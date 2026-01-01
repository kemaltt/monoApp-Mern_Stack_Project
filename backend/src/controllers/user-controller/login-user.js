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
    }
  };
}

module.exports = {
  loginUser,
};
