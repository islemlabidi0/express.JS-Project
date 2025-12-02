

require('dotenv').config(); 
const express = require('express');
const connectDB = require('./connection');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware to parse JSON
app.use(express.json());

// Use auth routes



app.use('/api/auth', authRoutes);

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
