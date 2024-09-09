const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAdmin, isManagerOrAdmin, isAuthenticated } = require('../middleware/authMiddleware');
//const authMiddleware = require('../middleware/authMiddleware');

// Routes for user management
//router.post('/', isAuthenticated, isAdmin, userController.createUser);
router.get('/',  isAuthenticated, isManagerOrAdmin, userController.getUsers); // Admin & Manager
router.get('/:id', isAuthenticated, userController.getUserById); // All users
router.put('/:id', isAuthenticated, isAdmin, userController.updateUser); // Admin only
router.delete('/:id',isAuthenticated, isAdmin, userController.deleteUser); // Admin (soft delete)
router.patch('/restore/:id',isAuthenticated, isAdmin, userController.restoreUser); // Admin (restore user)
router.delete('/permanant/:id', isAuthenticated, isAdmin, userController.permanantDeleteUser );
module.exports = router;
