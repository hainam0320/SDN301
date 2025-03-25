const express = require("express");
const { getCategory } = require("../controller/categoryController");
const { authMiddleware } = require("../middleware/middleware");

const categoryRouter = express.Router();

categoryRouter.get("/getcategory", authMiddleware, getCategory);

module.exports = categoryRouter;