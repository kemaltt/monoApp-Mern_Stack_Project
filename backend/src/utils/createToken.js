const jwt = require("jsonwebtoken");

// const TEN_MINUTES = 10 * 60;
const TEN_DAYS = 10 * 24 * 60 * 60 ;
function createToken(user, duration = TEN_DAYS, tokenType = "access") {
  const initatedAtTimestamp = Math.floor(Date.now() / 1000);
  const expiresAtTimestamp = initatedAtTimestamp + duration;

  const tokenPayload = {
    sub: user._id.toString(),
    iat: initatedAtTimestamp,
    exp: expiresAtTimestamp,
    role: user.role || "user",
    tokenType,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });
  return token;
}

module.exports = {
  createToken,
};
