const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public routes
router.post('/signup', authController.signup); // Only creates the first Admin user
router.post('/login', authController.login); // Allows users to log in
router.post('/register', authController.register); // Admin can register new users

module.exports = router;
