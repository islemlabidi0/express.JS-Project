const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { name, login, password, role } = req.body;

    // 1) nchouf itha login mawjoud
    const existing = await User.findOne({ login });
    if (existing) {
      return res.status(400).json({ message: "Login already used" });
    }

    // 2) Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3) nasnaa user jdid
    const user = await User.create({
      name,
      login,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        login: user.login,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


