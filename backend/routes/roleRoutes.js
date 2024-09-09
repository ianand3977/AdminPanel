const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { isAdmin } = require('../middleware/authMiddleware');

// Routes for role management
router.post('/:id/assign-role', isAdmin, roleController.assignRole); // Admin assigns role
router.post('/:id/revoke-role', isAdmin, roleController.revokeRole); // Admin revokes role

module.exports = router;
