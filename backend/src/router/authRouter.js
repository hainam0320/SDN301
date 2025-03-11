const express = require("express");
const {
  userRegister,
  userLogin,
  forgetPassword,
  resetPassword,
  changePassword,
  getAllUsers,
} = require("../controller/userController");
const { authMiddleware, adminMiddleware } = require("../middleware/middleware");

const authRouter = express.Router();

authRouter.post("/register", userRegister);
authRouter.post("/login", userLogin);
authRouter.post("/forget-password", forgetPassword);
authRouter.post("/reset-password/:token", resetPassword);
authRouter.post("/change-password", changePassword);
authRouter.post("/token", authMiddleware);
authRouter.get("/getusers", authMiddleware, adminMiddleware, getAllUsers);

module.exports = authRouter;
