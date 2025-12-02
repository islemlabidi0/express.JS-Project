require('dotenv').config(); 
const express = require('express');
const connectDB = require('./connection');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 7000;

// middleware لتحويل JSON
app.use(express.json());

// ربط routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
