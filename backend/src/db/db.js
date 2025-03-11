const { mongoose } = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Server is connected successfully");
  } catch (error) {
    console.log("Server connection is failed");
  }
};

module.exports = dbConnection;
