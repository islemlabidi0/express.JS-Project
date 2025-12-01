const express = require('express');
const connectDB = require('./connection'); // import the connecting function
const userRoute = require('./UserRoute');

require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 7000;


// Connect to MongoDB
connectDB();
app.use(express.json());
app.use('/api', userRoute)
// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
