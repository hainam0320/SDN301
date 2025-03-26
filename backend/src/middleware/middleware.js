const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const generateToken = async (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
};

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    // Lấy token sau "Bearer "
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).send({ message: "User not found" });
      }

      req.user = user; // Lưu thông tin user vào request
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).send({ message: "Invalid token" });
      }
      throw err;
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).send({ message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { generateToken, authMiddleware, adminMiddleware };
