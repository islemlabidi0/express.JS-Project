const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
  try {
    const { name, login, password, role } = req.body;

     // 🔹 Vérification des champs
    if (!name || !login || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }


    // 🔹 Vérification de l'email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!login || !emailRegex.test(login)) {
  return res.status(400).json({ message: "Invalid or missing email address" });
}



     // 🔹 Vérification du mot de passe
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }


    if (!["user", "manager"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'manager'" });
    }



    // 🔹 Vérifier si le login existe déjà
    const existing = await User.findOne({ login });
    if (existing) {
      return res.status(400).json({ message: "Login already used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      login,
      password: hashedPassword,
      role
    });

    // 🔥 إنشاء رمز التفعيل
    const activationToken = user.createActivationToken();
    await user.save();

    // 🔥 إعداد SMTP لإرسال الإيميل
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 🔥 رابط التفعيل
    const activationURL = `http://localhost:${process.env.PORT}/api/auth/activate/${activationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.login,
      subject: "Activate Your Account",
      html: `
        <h2>Welcome ${user.name}</h2>
        <p>Click the button to activate your account</p>
        <a href="${activationURL}" style="
          background:#4CAF50;
          padding:10px 20px;
          color:white;
          text-decoration:none;
          border-radius:5px;
        ">Activate Account</a>
      `
    });

    res.status(201).json({
      message: "Account created. Check your email to activate your account."
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
