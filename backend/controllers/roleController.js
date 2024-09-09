const { User } = require('../models'); // Assuming Sequelize model for User

// Assign a role to a user (Admin only)
exports.assignRole = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id); // Using Sequelize's findByPk to get user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = req.body.role; // Assign the new role from the request body
        await user.save(); // Save the updated user

        res.json({ message: 'Role assigned', user }); // Respond with the updated user data
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Revoke a role from a user (Admin only)
exports.revokeRole = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id); // Using Sequelize's findByPk to get user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = 'Employee'; // Set role to 'Employee' when revoked
        await user.save(); // Save the updated user

        res.json({ message: 'Role revoked', user }); // Respond with the updated user data
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
