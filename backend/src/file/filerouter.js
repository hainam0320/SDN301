const express = require("express");
const { fileController, deleteFile } = require("./filecontroller");

const fileRouter = express.Router();

fileRouter.post("/file", fileController);
fileRouter.delete("/delete/:id", deleteFile);

module.exports = fileRouter;
