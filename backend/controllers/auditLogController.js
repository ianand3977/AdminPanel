const { AuditLog } = require('../models'); // Assuming Sequelize model for Audit Logs

// Get audit logs (Admin only)
exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.findAll();
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
