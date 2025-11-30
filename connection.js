//lhne n3mlou l connection m3a mongo DB
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGOURL = process.env.MONGO_URL;
    await mongoose.connect(MONGOURL);
    //ken l cnx 5edmt 
    console.log("Database connected successfully");
    //ken fama error
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
