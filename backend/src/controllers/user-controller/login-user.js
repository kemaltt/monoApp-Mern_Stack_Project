const { UserDAO } = require("../../db-access");
const { makeUser } = require("../../domain/User");
const jwt = require("jsonwebtoken");
const { hash } = require("../../utils/hash");
const { createToken } = require("../../utils/createToken");

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

  const ONE_DAY = 24 * 60 * 60
  const accessToken = createToken(user);
  const refreshToken = createToken(user, ONE_DAY, "refresh");

  return { accessToken, refreshToken };
}

module.exports = {
  loginUser,
};
