const express = require('express');
const connectDB = require('./connection'); // import the connecting function

require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 7000;

// Connect to MongoDB
connectDB();
// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
