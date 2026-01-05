const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Access denied. Token required." });
  }

  const token = bearerHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.payload = payload;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ msg: "Token expired" });
    }
    return res.status(403).json({ msg: "Invalid token" });
  }
};

module.exports = verifyToken;
