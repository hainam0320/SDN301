const randomString = require("randomstring");
const File = require("./filemodel");
const fs = require("fs");

function fileUpload(fileUploaded) {
  let name = randomString.generate({
    length: 12,
    charset: "alphabetic",
  });
  let fileExtension = fileUploaded.name.split(".");
  fileExtension = fileExtension[fileExtension.length - 1];

  let mimeType = fileUploaded.mimetype.split("/")[0];
  mimeType =
    mimeType === "image" || mimeType === "video" ? mimeType : "document";

  let fileName = `${name}.${fileExtension}`;

  let filePath = "/public/images/" + fileName;

  fileUploaded.mv("./src" + filePath);
  return {
    name: fileName,
    ext: fileExtension,
    mimeType: mimeType,
    path: filePath,
  };
}

const fileController = async (req, res) => {
  try {
    const { file } = req.files;
    if (!file) {
      return res.status(400).send({ message: "Please provide image" });
    }
    let fileData = fileUpload(file);

    let createFile = await File.create(fileData);

    return res
      .status(200)
      .send({ message: "File uploaded successfully", createFile });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const fileData = await File.findById(id);

    const filePath = "./src" + fileData.path;

    fs.unlink(filePath, (err) => {
      if (err) {
        console.log("Error while deleting file");
      }
      console.log("File delete successfully");
    });
    await File.deleteOne(fileData);

    return res.status(200).send({ message: "File deleted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = { fileController, deleteFile };
