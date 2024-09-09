const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const { isAdmin } = require('../middleware/authMiddleware');

// Routes for audit logs
router.get('/', isAdmin, auditLogController.getAuditLogs); // Admin only

module.exports = router;
