const { UserDAO } = require("../../db-access");
const jwt = require("jsonwebtoken");

async function verifyEmail({ token }) {
  try {
    if (!token) {
      throw new Error("Verification token is required");
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by email
    const user = await UserDAO.findByEmail(decoded.email);

    if (!user) {
      throw new Error("Invalid verification token");
    }

    // Check if token matches
    if (user.verification_token !== token) {
      throw new Error("Invalid verification token");
    }

    // Check expiration
    if (!user.verification_token_expires || new Date() > new Date(user.verification_token_expires)) {
      throw new Error("Verification token has expired");
    }

    // Check if already verified
    if (user.is_verified) {
      throw new Error("Email already verified");
    }

    // Update user: set verified, clear token
    await UserDAO.updateUser(user._id, {
      is_verified: true,
      verification_token: null,
      verification_token_expires: null
    });

    return { message: "Email verified successfully" };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error("Verification token has expired");
    }
    throw error;
  }
}

module.exports = { verifyEmail };
