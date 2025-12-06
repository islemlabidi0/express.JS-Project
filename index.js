

require('dotenv').config(); 
const express = require('express');
const connectDB = require('./connection');
const authRoutes = require('./routes/authRoutes');
const userRoute = require('./routes/UserRoute');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware to parse JSON
app.use(express.json());


app.use('/api/users', userRoute)
// start server


// Use auth routes
app.use('/api/auth', authRoutes);

// houni naayt 3la project routes
app.use('/api/projects', projectRoutes);
// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
