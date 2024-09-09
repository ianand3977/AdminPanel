const User = require('../models/userModel');
const Role = require('../models/roleModel');

const roleMiddleware = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id);
      const role = await Role.findByPk(user.roleId);
      
      if (!roles.includes(role.name)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      next();
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = roleMiddleware;
