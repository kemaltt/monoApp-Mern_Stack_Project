const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token eksikse hata döndür
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Tokeni doğrula
    const userClaims = jwt.verify(token, process.env.JWT_SECRET);

    // Doğrulanan bilgileri request'e ekle
    req.userClaims = userClaims;

    // Middleware zincirine devam et
    next();
  } catch (error) {
    // Doğrulama hatası
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };
