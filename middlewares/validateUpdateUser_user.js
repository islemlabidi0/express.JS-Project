const User = require('../models/UserModel');

module.exports = async (req, res, next) => {
  const { name, login, password } = req.body;

 
  if (!name && !login && !password) {
    return res.status(400).json({ message: 'At least one field (name, login, password) is required' });
  }

  
  if (login) {
    const existingUser = await User.findOne({ login });
    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Login already exists' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(login)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
  }


  if (password && password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  next();
};
