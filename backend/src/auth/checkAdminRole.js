const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const { UserDAO } = require('../db-access');

const checkAdminRole = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user =  await UserDAO.findById(decoded.sub || decoded.id); // If using UserDAO instead of UserModel

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = checkAdminRole;
