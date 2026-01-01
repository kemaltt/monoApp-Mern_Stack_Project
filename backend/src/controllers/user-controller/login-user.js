const { UserDAO } = require("../../db-access");
const { makeUser } = require("../../domain/User");
const jwt = require("jsonwebtoken");
const { hash } = require("../../utils/hash");
const { createToken } = require("../../utils/createToken");
const { createActivityLog } = require("../../services/activity-log.service");

async function loginUser({ email, password }) {

  const foundUser = await UserDAO.findByEmail(email);

  if (!foundUser) {
    throw new Error("Your credentials are incorrect!");
  }

  // Check if email is verified
  if (!foundUser.is_verified) {
    throw new Error("Lütfen mailinize gelen linki onaylayın");
  }

  const user = makeUser(foundUser);
  const passwordHash = hash(password + "" + user.passwordSalt);

  if (user.passwordHash !== passwordHash) {
    throw new Error("Your credentials are incorrect!");
  }

  // Check if trial period has expired
  if (foundUser.license_type === 'trial' && foundUser.trial_end_date) {
    const now = new Date();
    const trialEndDate = new Date(foundUser.trial_end_date);
    
    if (now > trialEndDate) {
      throw new Error("Your free trial period has expired. Please contact support.");
    }
  }

  // Update lastLogin
  await UserDAO.updateUser(foundUser._id, { lastLogin: new Date() });

  // Log login activity
  await createActivityLog({
    user: foundUser._id,
    userName: foundUser.name || 'Unknown',
    action: 'login',
    resourceType: 'auth',
    details: { email },
  });

  const ONE_DAY = 24 * 60 * 60
  const accessToken = createToken(user);
  const refreshToken = createToken(user, ONE_DAY, "refresh");

  return { 
    accessToken, 
    refreshToken,
    user: {
      id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      profile_image: foundUser.profile_image,
      license_type: foundUser.license_type,
      trial_end_date: foundUser.trial_end_date,
    }
  };
}

module.exports = {
  loginUser,
};
