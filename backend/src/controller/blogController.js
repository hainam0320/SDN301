const randomString = require("randomstring");
const Blog = require("../model/blogModel");
const fs = require("fs");



const createBlog = async (req, res) => {
  try {
    const { userId } = req.user; // Lấy userId từ token
    const { title, description, category, image } = req.body;

    if (!title || !description || !category || !image) {
      return res.status(400).send({ message: "Vui lòng nhập đủ thông tin!" });
    }

    // Tạo blog mới
    const blogData = await Blog.create({
      title,
      description,
      category,
      image, // URL ảnh
      userId,
    });

    return res.status(201).send({ message: "Tạo blog thành công!", blog: blogData });
  } catch (error) {
    console.error("Lỗi khi tạo blog:", error);
    return res.status(500).send({ message: "Lỗi server!" });
  }
};

// this is only for test purpose ------------------->
const params = (req, res) => {
  const { id } = req.params;
  console.log(id);
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blogData = await Blog.findById(id);

    const filePath = "./src" + blogData.image.path;
    // const filePath = "./src/public/images/oLGIOaTFwxyr.jpg";

    fs.unlink(
      filePath,
      (err) => {
        console.log("Error while deleting the file", err);
      },
      console.log("File deleted successfully")
    );

    await Blog.findByIdAndDelete(id);

    return res.status(200).send({ message: "File deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (!blogs) {
      return res.status(400).send({ message: "Blogs not found" });
    }

    return res.status(200).send({ message: "Blogs found", blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getUserBlogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const userBlogs = await Blog.find({ userId });

    if (!userBlogs) {
      return res.status(400).send({ message: "Blogs not found" });
    }

    return res.status(200).send({ message: "Blogs found", userBlogs });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const blogUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, category } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, description, category },
      { new: true }
    );

    return res
      .status(200)
      .send({ message: "Blog update successfully", updatedBlog });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
const getBlogsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params; // Lấy category ID từ URL params

    if (!categoryId) {
      return res.status(400).send({ message: "Category ID is required" });
    }

    const blogs = await Blog.find({ categoryId });

    return res.status(200).send( blogs);
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("category", "name")
      .populate("userId", "userName");
    if (!blog) {
      return res.status(400).send({ message: "Blog not found" });
    }

    return res.status(200).send({ message: "Blog found", blog });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
module.exports = {
  createBlog,
  params,
  deleteBlog,
  getAllBlogs,
  getUserBlogs,
  blogUpdate,
  getBlogsByCategory,
  getBlogById
};
