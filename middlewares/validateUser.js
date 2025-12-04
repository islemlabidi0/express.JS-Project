
const User = require('../models/UserModel'); 
module.exports = async(req, res, next) => {
  const { name, login, password, role } = req.body;
   
 const existingUser = await User.findOne({ login });
  if (existingUser)
    return res.status(400).json({ message: 'Login exists' });
 
  if (!name || !login || !password || !role)
    return res.status(400).json({ message: 'All fields are required' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(login))
    return res.status(400).json({ message: 'Invalid email format' });

  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  if (!['user','manager'].includes(role))
    return res.status(400).json({ message: 'Role must be user or manager' });

  next();
};
