const express = require("express");
const {
  createBlog,
  params,
  deleteBlog,
  getAllBlogs,
  getUserBlogs,
  blogUpdate,
} = require("../controller/blogController");
const { authMiddleware } = require("../middleware/middleware");

const blogRouter = express.Router();

blogRouter.post("/create/blog", authMiddleware, createBlog);
blogRouter.post("/create/blog/:id", params);
blogRouter.delete("/create/blog/:id", authMiddleware, deleteBlog);
blogRouter.get("/getblog", getAllBlogs);
blogRouter.get("/getuserblog/:userId", authMiddleware, getUserBlogs);
blogRouter.put("/updateblog/:id", blogUpdate);

module.exports = blogRouter;
