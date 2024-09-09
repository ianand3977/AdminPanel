const jwt = require('jsonwebtoken');
const { User, Role } = require('../models'); // Make sure Role is imported

exports.isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided or malformed token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Include the associated Role when fetching the User
    const user = await User.findByPk(decoded.id, {
      include: [{
        model: Role,
        as: 'role' // Make sure this alias matches the one in your association
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ message: 'Not authenticated' });
  }
};



exports.isAdmin = (req, res, next) => {
    console.log('req.user:', req.user); // Debug log
    if (req.user && req.user.role && req.user.role.name === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access only' });
    }
};


exports.isManagerOrAdmin = (req, res, next) => {
    console.log('req.user:', req.user); // Log req.user to see if it has the expected properties
  
    // Check if the role exists and if it matches 'Admin' or 'Manager'
    if (req.user && req.user.role && (req.user.role.name === 'Admin' || req.user.role.name === 'Manager')) {
      next();
    } else {
      res.status(403).json({ message: 'Manager or Admin access only' });
    }
  };
  

exports.isManagerOrEmployee = (req, res, next) => {
    if (req.user.role === 'Manager' || req.user.role === 'Employee') {
        next();
    } else {
        res.status(403).json({ message: 'Manager or Employee access only' });
    }
};
exports.hasRole = (roles) => (req, res, next) => {
    if (roles.includes(req.user.role)) {
        return next();
    }
    return res.status(403).json({ message: `${roles.join(' or ')} access only` });
};
