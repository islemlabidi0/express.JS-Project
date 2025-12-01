const bcrypt = require('bcryptjs');
const User = require('./models/UserModel.js');

const validateUser = (req, res, next) => {
  const { name, login, password, role } = req.body;
    // netaakdou ken les champs lkol mawjoudin
    if (!name || !login || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
        }


    // netakdou ken lform mt3 l'adresse email s7i7a
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!login || !emailRegex.test(login)) {
        return res.status(400).json({ message: "Invalid or missing email address" });
    }



    // netakdou ken l password fih akther mn 6 characters 
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }


    if (!["user", "manager"].includes(role)) {
        return res.status(400).json({ message: "Role must be 'user' or 'manager'" });
    }
    next();
};
module.exports = validateUser;