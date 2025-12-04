const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

//Middleware d’authentification mebni ala JWT
module.exports = async (req, res, next) => {
  try {
      // njib token mel header Authorization
    // hedhi tji haka: "Bearer jdskfjsdkfjsdf"
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)  // ken ma famech token, nraja3 error
      return res.status(401).json({ message: 'No token provided' });

     //nverifyi token 

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // njib l user mel database b id li fi token
    const user = await User.findById(decoded.id);
    //nverifi ken l user mawjoud
    if (!user) 
      return res.status(401).json({ message: 'Invalid token user' });
// n7ot l user fi req bch nasta3mlouh fel routes ba3d
    req.user = user;
    next();
// ken fama error fel verification nraja3 error
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};