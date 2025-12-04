module.exports = (req, res, next) => {
  const { login, role, password } = req.body;

  if (!login && !role && !password)
    return res.status(400).json({ message: 'Nothing to update' });

  if (login) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(login)) 
      return res.status(400).json({ message: 'Invalid email' });
  }

  if (password && password.length < 6)
    return res.status(400).json({ message: 'Password must be 6+ characters' });

  if (role && !['user','manager'].includes(role))
    return res.status(400).json({ message: 'Invalid role' });

  next();
};
