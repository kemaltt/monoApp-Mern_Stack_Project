const express = require("express");
// const multer = require("multer");
// const { doAuthMiddleware } = require("../auth/doAuthMiddleware");
const { makeDoAuthMiddleware } = require("../auth/doAuthMiddleware");
const { showWallet } = require("../controllers/wallet-controller/show-wallet");
const { showMyProfile } = require("../controllers/user-controller/show-my-profile");
const { refreshUserToken } = require("../controllers/user-controller/refresh-user-token");
const { loginUser } = require("../controllers/user-controller/login-user");
const { registerUser } = require("../controllers/user-controller/register-user");
const { verifyEmail } = require("../controllers/user-controller/verify-email");
const { resendVerification } = require("../controllers/user-controller/resend-verification");
const { showAllUser } = require("../controllers/user-controller/show-all-users");
const { updateUserProfile } = require("../controllers/user-controller/update-user");
const { uploadToFirebase, upload } = require("../services/file-upload.service");
const UserModel = require("../models/UserModel");
const { register, login, updateUser } = require("../controllers/auth-controller");
const { getTransactions } = require("../controllers/transaction-controller");
const { verifyToken } = require("../auth/verifyToken");
const { forgotPassport, resetPassport } = require("../controllers/auth-passport-controller");

const userRouter = express.Router();

const doAuthMiddleware = makeDoAuthMiddleware("access");
const doRefreshTokenMiddleware = makeDoAuthMiddleware("refresh");

userRouter.get("/allUsers", doAuthMiddleware, async (_, res) => {
  try {
    const allUsers = await showAllUser();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({
      error: {
        message: error
          ? error.message
          : "Unknown error while loading all users.",
      },
    });
  }
});

// const storage = multer.diskStorage({
//   destination: function (_, _, cb) {
//     cb(null, "uploads/profile");
//   },
//   filename: function (_, file, cb) {
//     cb(null, file.originalname); //Appending extension
//   },
// });
// const upload = multer({ storage });
const uploadMiddleware = upload.single("profile_image");

// new routes
// userRouter.post("/register",uploadMiddleware ,register)
// userRouter.post("/login", login)
// userRouter.put("/update-user", uploadMiddleware, verifyToken, updateUser)
// userRouter.get("/transactions", verifyToken, getTransactions)



userRouter.post("/register", uploadMiddleware, async (req, res) => {
  try {
    const userInfo = req.body;
    const userId = 12345;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.file) {
      const file = req.file; // req.file'deki dosyayı değişkene ata
      const uploadedFile = await uploadToFirebase(file, "profile_image", null, userId);
      console.log('file uploaded', uploadedFile);

      const user = await registerUser({ ...userInfo, profile_image: uploadedFile });
      res.json(user);
    } else {
      const user = await registerUser({ ...userInfo });
      res.json(user);
    }

  } catch (error) {

    res.status(500).json({
      message: error.message || "Unknown error while registering new user.",
    });
  }
});



userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new Error("E-Mail is required.");
    }

    if (!password) {
      throw new Error("Password is required.");
    }

    const { accessToken, refreshToken , user } = await loginUser({
      email,
      password
    });

    req.session.refreshToken = refreshToken;

    res.json({ accessToken , user });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString() || "Internal Server Error.",
    });
  }
});
userRouter.get("/logout", async (req, res) => {
  req.session.refreshToken = null;
  res.status(200).json({ message: 'Logged out successfully.' });
});

userRouter.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      throw new Error("Verification token is required");
    }

    const result = await verifyEmail({ token });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Email verification failed"
    });
  }
});

userRouter.post("/resend-verification-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error("Email is required");
    }

    const result = await resendVerification({ email });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to resend verification email"
    });
  }
});

// Forgot passport (send email with reset link)
userRouter.post('/forgot-passport', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw new Error('Email is required');
    const result = await forgotPassport(req, res);
    // forgotPassport handles response, but ensure fallback
    if (!res.headersSent) res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to send passport reset email' });
  }
});

// Reset passport (user submits new passport using key)
userRouter.put('/reset-passport/:reset_passport_key', async (req, res) => {
  try {
    const { reset_passport_key } = req.params;
    if (!reset_passport_key) throw new Error('Reset key is required');
    const result = await resetPassport(req, res);
    if (!res.headersSent) res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to reset passport' });
  }
});

userRouter.get("/transactions", doAuthMiddleware, async (req, res) => {
  try {
    const userId = req.userClaims.sub;
    const userWallet = await showWallet({ userId });

    res.status(200).json(userWallet);
  } catch (err) {
    res
      .status(500)
      .json({ err: { message: err ? err.message : "User not found..." } });
  }
});

userRouter.get("/profileInfo", doAuthMiddleware, async (req, res) => {
  try {
    const userId = req.userClaims.sub; // an den token wird erkannt, um welchen user es sich handelt...
    const userProfile = await showMyProfile({ userId, req });
    res.status(200).json(userProfile);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: { message: err.message } });
  }
});

// Update user profile
userRouter.put("/update-profile", uploadMiddleware, doAuthMiddleware, async (req, res) => {
  try {
    const userId = req.userClaims.sub;
    const updateData = {};

    // Name ve email güncelleme
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.email) updateData.email = req.body.email;

    // Profile image yükleme
    if (req.file) {
      const file = req.file;
      const uploadedFile = await uploadToFirebase(file, "profile_image", null, userId);
      console.log('Profile image uploaded:', uploadedFile);
      updateData.profile_image = uploadedFile;
    }

    // Kullanıcı profilini güncelle
    const updatedUser = await updateUserProfile({ userId, updateData, req });
    
    res.status(200).json({ 
      status: 'success', 
      message: 'Profile updated successfully', 
      data: updatedUser 
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ 
      status: 'error', 
      message: err.message || 'Failed to update profile' 
    });
  }
});

userRouter.post("/refreshtoken", doRefreshTokenMiddleware, async (req, res) => {
  try {
    const userId = req.userClaims.sub;

    const accessToken = await refreshUserToken({ userId });
    res.json({ token: accessToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString() || "Internal Server Error.",
    });
  }
});
module.exports = {
  userRouter,
};
