
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
  try {
    const { name, login, password, role } = req.body;

   

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, login, password: hashed, role });
    const activationToken = user.createActivationToken();
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const url = `http://localhost:${process.env.PORT}/api/auth/activate/${activationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: login,
      subject: 'Activate your account',
      html: `<h3>Hello ${name}</h3><a href='${url}'>Activate</a>`
    });

    res.status(201).json({ message: 'Account created. Check your email.' });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.activate = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ activationToken: token });

    if (!user)
      return res.status(400).json({ message: 'Invalid token' });

    user.isActive = true;
    user.activationToken = null;
    await user.save();

    res.json({ message: 'Account activated' });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ login });

    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!user.isActive) return res.status(401).json({ message: 'Account not activated' });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: "Login successful", token, user: { id: user._id, name: user.name, login: user.login, role: user.role } });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
