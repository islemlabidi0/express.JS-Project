const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/userModel');


router.post('/register', authController.register);

router.get('/activate/:token', async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ activationToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid activation token" });
  }

  user.isActive = true;
  user.activationToken = undefined;
  await user.save();

  res.status(200).json({ message: "Account activated successfully" });
});



module.exports = router;
