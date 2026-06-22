const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Trying to connect...");
    await mongoose.connect(process.env.MONGO_URI);
    
    
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("DB ERROR:", error.message);
  }
};

module.exports = connectDB;