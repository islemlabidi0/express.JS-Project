const User = require('../models/userModel');
const bcrypt = require('bcrypt');



//login
const jwt = require('jsonwebtoken');  

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    // 1) nalka user bil login
    const user = await User.findOne({ login });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2) nkaren el password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // 3) naamel JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,   
      { expiresIn: "1d" }       
    );

    // 4) Return response
    res.status(200).json({
      message: "Login successful",
      token,
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
