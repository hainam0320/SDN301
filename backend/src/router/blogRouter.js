const express = require("express");
const {
  createBlog,
  params,
  deleteBlog,
  getAllBlogs,
  getUserBlogs,
  blogUpdate,
  getBlogsByCategory,
  getBlogById
} = require("../controller/blogController");
const { authMiddleware } = require("../middleware/middleware");

const blogRouter = express.Router();

blogRouter.post("/create/blog", authMiddleware, createBlog);
blogRouter.post("/create/blog/:id", params);
blogRouter.delete("/create/blog/:id", authMiddleware, deleteBlog);
blogRouter.get("/getblog", getAllBlogs);
blogRouter.get("/getuserblog/:userId", authMiddleware, getUserBlogs);
blogRouter.put("/updateblog/:id", blogUpdate);
blogRouter.get("/getblog/:id", getBlogById);
blogRouter.get("/getblogbycategory/:categoryId", getBlogsByCategory);

module.exports = blogRouter;
