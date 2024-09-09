// controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models'); // Ensure correct imports

// Signup route (Admin only)
// Signup route (Admin only)
exports.signup = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Fetch the Admin role's UUID
      const role = await Role.findOne({ where: { name: 'Admin' } });
      if (!role) {
        return res.status(400).json({ message: 'Admin role not found' });
      }
  
      // Check if an Admin user already exists
      const adminExists = await User.findOne({ where: { roleId: role.id } });
      if (adminExists) {
        return res.status(400).json({ message: 'Admin already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new Admin user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        roleId: role.id, // Use the Admin role's UUID
      });
  
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
// Register (Admin only)
exports.register = async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
  
      const roleRecord = await Role.findOne({ where: { name: role } });
      if (!roleRecord) {
        return res.status(400).json({ message: 'Invalid role' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        roleId: roleRecord.id,
      });
  
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) return res.status(400).json({ message: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user.id, role: user.roleId }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
      });
  
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
