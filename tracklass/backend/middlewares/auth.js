const jwt = require('jsonwebtoken');
const User = require('../models/User');


module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded.user;
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for provided token');
      return res.status(401).json({ msg: 'User not found, authorization denied' });
    }
    next();
  } catch (err) {
    console.error('Something wrong with auth middleware', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};