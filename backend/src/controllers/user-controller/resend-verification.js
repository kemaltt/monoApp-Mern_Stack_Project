const { UserDAO } = require("../../db-access");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../../services/email.service");

async function resendVerification({ email }) {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    // Find user by email
    const user = await UserDAO.findByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if already verified
    if (user.is_verified) {
      throw new Error("Email is already verified");
    }

    // Generate new verification token
    const verificationToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30m" } // 30 minutes
    );

    // Set expiration date (30 minutes from now)
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 30);

    // Update user with new token
    await UserDAO.updateUser(user._id, {
      verification_token: verificationToken,
      verification_token_expires: expirationDate
    });

    // Generate verification URL
    const verificationURL = `${process.env.API_PATH === 'production' ? process.env.CLIENT_URL : process.env.CLIENT_LOCAL_URL}/verify-email?token=${verificationToken}`;

    // Send verification email
    await sendVerificationEmail({
      email: user.email,
      name: user.name,
      subject: "Verify Your Email - Mono App",
      verificationURL,
      currentYear: new Date().getFullYear()
    });

    return { message: "Verification email sent successfully" };
  } catch (error) {
    throw error;
  }
}

module.exports = { resendVerification };
