const randomString = require("randomstring");
const Blog = require("../model/blogModel");
const fs = require("fs");

function fileUpload(fileData) {
  const name = randomString.generate({
    length: 12,
    charset: "alphabetic",
  });

  let fileExtension = fileData.name.split(".");
  fileExtension = fileExtension[fileExtension.length - 1];

  let mimeType = fileData.mimetype.split("/")[0];
  mimeType =
    mimeType === "image" || mimeType === "video" ? mimeType : "document";

  let fileName = `${name}.${fileExtension}`;

  let filePath = "/public/images/" + fileName;

  fileData.mv("./src" + filePath);

  return {
    name: fileName,
    ext: fileExtension,
    mimeType: mimeType,
    path: filePath,
  };
}

const createBlog = async (req, res) => {
  try {
    const { userId } = req.user;
    const { file } = req.files;

    const { title, description, category } = req.body;

    if (!title || !description || !category || !file || !userId) {
      return res
        .status(400)
        .send({ message: "Please provide all required fields." });
    }

    const fileData = fileUpload(file);

    const blogData = await Blog.create({
      title,
      description,
      category,
      image: fileData,
      userId: userId,
    });
    return res
      .status(201)
      .send({ message: "Blog created successfully", blogData });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
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

module.exports = {
  createBlog,
  params,
  deleteBlog,
  getAllBlogs,
  getUserBlogs,
  blogUpdate,
};
