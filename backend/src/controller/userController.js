const { generateToken } = require("../middleware/middleware");
const User = require("../model/userModel");
const { hashPassword, comparePassword } = require("../secure/hashPassword");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const userRegister = async (req, res) => {
  try {
    const { userName, lastName, email, phone, password } = req.body;

    if (!userName || !lastName || !email || !phone || !password) {
      return res
        .status(400)
        .send({ message: "Please provide all require fields" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User already register. Please login" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      userName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    return res
      .status(201)
      .send({ message: "User register successfully", newUser });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide all login required fields" });
    }

    const isUser = await User.findOne({ email });

    const token = await generateToken(isUser._id);

    if (!isUser) {
      return res
        .status(400)
        .send({ message: "User not found please register" });
    }

    const isMatchPassword = await comparePassword(password, isUser.password);

    if (!isMatchPassword) {
      return res.status(400).send({ message: "Please provide valid password" });
    }

    return res.status(200).send({ message: "User login successfully", token });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Please provide email" });
    }

    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res
        .status(400)
        .send({ message: "User not found please register" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const receiver = {
      from: "webdesignwalah@gmail.com",
      to: email,
      subject: "Password Reset Request",
      text: `Click on this link to generate your new password ${process.env.CLIENT_URL}/reset-password/${token}`,
    };

    await transporter.sendMail(receiver);

    return res.status(200).send({
      message: "Password reset link send successfully on your gmail account",
    });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).send({ message: "Please provide password" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({ email: decode.email });

    const newhashPassword = await hashPassword(password);

    user.password = newhashPassword;
    await user.save();

    return res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res
        .status(400)
        .send({ message: "Please provide all required fields" });
    }

    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res
        .status(400)
        .send({ message: "User not found please register" });
    }

    const isMatchPassword = await comparePassword(
      currentPassword,
      checkUser.password
    );

    if (!isMatchPassword) {
      return res
        .status(400)
        .send({ message: "Current password does not match" });
    }

    const newHashPassword = await hashPassword(newPassword);

    await User.updateOne({ email }, { password: newHashPassword });

    return res.status(200).send({ message: "Password change successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(400).send({ message: "Users not found" });
    }

    return res.status(200).send({ message: "Users found", users });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  forgetPassword,
  resetPassword,
  changePassword,
  getAllUsers,
};
