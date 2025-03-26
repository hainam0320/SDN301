const randomString = require("randomstring");
const Blog = require("../model/blogModel");
const fs = require("fs");



const mongoose = require('mongoose'); // Đảm bảo bạn đã import mongoose

const createBlog = async (req, res) => {
  try {
    const { title, description, category, image } = req.body;
    const userId = req.user._id;

    if (!title || !description || !category || !image) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin!" });
    }

    // Kiểm tra xem ID danh mục có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "ID danh mục không hợp lệ!" });
    }

    const newBlog = new Blog({
      title,
      description,
      category: category, // Giả sử chuỗi category là một ObjectId hợp lệ, Mongoose sẽ tự xử lý
      image,
      userId: userId,
    });

    await newBlog.save();

    return res.status(201).json({
      message: "Tạo blog thành công!",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Lỗi khi tạo blog:", error);
    return res.status(500).json({ message: "Lỗi server!" });
  }
};
// this is only for test purpose ------------------->
const params = (req, res) => {
  const { id } = req.params;
  console.log(id);
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID blog từ request params
    const userId = req.user._id; // Lấy userId từ middleware (đã xác thực)

    // ✅ 1. Kiểm tra blog có tồn tại không
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy blog!" });
    }

    // ✅ 2. Kiểm tra quyền xóa (chỉ admin hoặc chủ bài viết)
    if (blog.userId.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Bạn không có quyền xóa blog này!" });
    }

    // ✅ 3. Xóa blog khỏi database
    await Blog.findByIdAndDelete(id);

    return res.status(200).json({ message: "Xóa blog thành công!" });
  } catch (error) {
    console.error("❌ Lỗi khi xóa blog:", error);
    return res.status(500).json({ message: "Lỗi server!" });
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

    // Tìm tất cả blog của user dựa trên userId
    const blogs = await Blog.find({ userId: userId })
      .populate("category", "name") // Lấy thông tin tên danh mục
      .populate("userId", "userName"); // Lấy thông tin userName của tác giả

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "Người dùng chưa có bài viết nào.", data: blogs });
    }

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy blog của user!", error: error.message });
  }
};

const blogUpdate = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID của blog từ URL params
    const { title, description, category } = req.body;
    const userId = req.user._id; // Lấy ID của người dùng từ middleware xác thực

    // Kiểm tra xem ID blog có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID blog không hợp lệ!" });
    }

    // Tìm blog cần cập nhật
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy blog!" });
    }

    // Kiểm tra quyền chỉnh sửa (chỉ admin hoặc chủ bài viết mới được sửa)
    if (blog.userId.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa blog này!" });
    }

    // Tạo một đối tượng chứa các trường cần cập nhật
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "ID danh mục không hợp lệ!" });
      }
      updateData.category = category;
    }

    // Cập nhật blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData, // Chỉ cập nhật các trường được cung cấp
      { new: true, runValidators: true } // Trả về blog đã cập nhật và chạy validation của model
    ).populate("category", "name").populate("userId", "userName"); // Lấy thông tin liên quan

    return res.status(200).json({ message: "Cập nhật blog thành công!", blog: updatedBlog });

  } catch (error) {
    console.error("Lỗi khi cập nhật blog:", error);
    return res.status(500).json({ message: "Lỗi server khi cập nhật blog!" });
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
