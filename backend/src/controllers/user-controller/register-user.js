const { UserDAO } = require("../../db-access");
const { makeUser } = require("../../domain/User");
const { hash, createRandomHash } = require("../../utils/hash");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../../services/email.service");

async function registerUser({ name, email, password, profile_image }) {
  const nameVal = /^(?=)(?=).{2,15}$/;
  const emailVal = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,15}$/i;
  const passwordVal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;

  const foundUser = await UserDAO.findByEmail(email);
  const passwordSalt = createRandomHash();
  const passwordHash = hash(password + "" + passwordSalt);

  if (!name) {
    throw new Error("Name is required.");
  } else if (!name.match(nameVal)) {
    throw new Error(
      "Name must be greater than 4 characters and less than 15 characters."
    );
  } else if (!email) {
    throw new Error("E-Mail is required.");
  } else if (!email.match(emailVal)) {
    throw new Error("Please enter a valid email!");
  } else if (!password) {
    throw new Error("Password is required!");
  } else if (!password.match(passwordVal)) {
    throw new Error("Please enter a valid password!");
  } else if (foundUser) {
    throw new Error("Your email is registered,please login");
    // return "your email address is registered,please login";
  } else {
    const newUser = makeUser({
      name,
      email,
      profile_image,
      passwordHash,
      passwordSalt,
    });

    const insertResult = await UserDAO.insertUser(newUser);

    // Generate verification token
    const verificationToken = jwt.sign(
      { id: insertResult.insertedId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    const tokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    
    // Set trial end date (30 days from now)
    const trialEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Update user with verification token and trial end date
    await UserDAO.updateUser(insertResult.insertedId, {
      verification_token: verificationToken,
      verification_token_expires: tokenExpiry,
      trial_end_date: trialEndDate
    });

    // Generate verification URL
    // const isProduction = process.env.API_PATH === 'production' || process.env.NODE_ENV === 'production';
    // const clientURL = isProduction ? process.env.CLIENT_URL : process.env.CLIENT_LOCAL_URL;
    // const verificationURL = `${clientURL}/verify-email?token=${verificationToken}`;
    const verificationURL = `${process.env.API_PATH === 'production' ? process.env.CLIENT_URL : process.env.CLIENT_LOCAL_URL}/verify-email?token=${verificationToken}`;

    // Send verification email
    try {
      await sendVerificationEmail({
        name,
        email,
        subject: "Mono App - Verify Your Email Address",
        currentYear: new Date().getFullYear(),
        verificationURL,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with registration even if email fails
    }

    const userView = {
      _id: insertResult.insertedId,
      name,
      email,
    };

    return {
      user: userView,
      message: "Registration successful! Please check your email to verify your account."
    };
  }
}

module.exports = {
  registerUser,
};
