let jwt = require("jsonwebtoken");

let verifyToken = async (req, res, next) => {
  let bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.status(401).json({ msg: "Access Denied,Access token required" });
  }
  let token = bearerToken.split(" ")[1];
  try {
    let payload = jwt.verify(token, "Mern");
    req.payload = payload;
    next();
  } catch (error) {
    return res.status(403).json({ msg: "Invalid or token expired" });
  }
};

module.exports = verifyToken;
