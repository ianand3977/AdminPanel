const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { isAdmin, isManagerOrEmployee, isAuthenticated } = require('../middleware/authMiddleware');

// Routes for project management
router.post('/',isAuthenticated, isAdmin, projectController.createProject); // Admin only
router.get('/', isAuthenticated, projectController.getProjects); // All users, role-based
router.get('/:id', isAuthenticated, projectController.getProjectById); // All users
router.put('/:id', isAuthenticated, isAdmin, projectController.updateProject); // Admin only
router.delete('/:id', isAuthenticated, isAdmin, projectController.deleteProject); // Admin (soft delete)
router.patch('/restore/:id', isAuthenticated, isAdmin, projectController.restoreProject); // Admin (restore project)

module.exports = router;
