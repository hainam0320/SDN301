const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const generateToken = async (userId) => {
  return await jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ message: "UnAuthrization acess" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decode;
    next();
  } catch (error) {
    return res.status(500).send({ message: "Something went wrongF" });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (!user.isAdmin) {
      return res.status(404).send({ message: "Page not found" });
    } else {
      next();
    }
    console.log(user);
  } catch (error) {
    return res.status(500).send({ message: "Something went wrongF" });
  }
};

module.exports = { generateToken, authMiddleware, adminMiddleware };
