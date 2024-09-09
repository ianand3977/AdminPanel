const { FORCE } = require('sequelize/lib/index-hints');
const { User, Role } = require('../models');

// Create a new user (Admin only)
exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            password: hashedPassword,
            role
        });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all users (Admin & Manager)
// Get all users (Admin & Manager)
exports.getUsers = async (req, res) => {
    try {
      const users = await User.findAll({
        include: [{
          model: Role, 
          as: 'role', // Ensure the alias matches
          attributes: ['name']
        }],
        attributes: ['id', 'username', 'email', 'createdAt']
      });
  
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Something went wrong!' });
    }
  };

// Get a user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [{
              model: Role,
              as: 'role', // Ensure the alias matches
              attributes: ['name']
            }],
            attributes: ['id', 'username', 'email', 'createdAt', ]
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a user (Admin only)


exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Allow only specific fields to be updated
        const allowedUpdates = ['username', 'email', 'role'];
        const updates = Object.keys(req.body).filter(key => allowedUpdates.includes(key));

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        // Apply updates to the user instance
        updates.forEach(key => user[key] = req.body[key]);

        // If updating the role, find the roleId from the Role model
        if (req.body.role) {
            const role = await Role.findOne({ where: { name: req.body.role } });
            if (!role) {
                return res.status(400).json({ message: 'Invalid role' });
            }
            user.roleId = role.id; // Set the foreign key roleId
        }

        // If updating the password, ensure it's hashed
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        res.json({
            message: 'User updated',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: req.body.role, // Send back the role name
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Soft delete a user (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        // Fetch the user including the associated role
        const user = await User.findByPk(req.params.id, {
            include: [{
                model: Role,
                as: 'role', // Ensure the alias matches
                attributes: ['name'] // Specify the attributes you want to include
            }]
        });
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update the user to set 'deleted' to true
        await user.update({ deleted: true });

        res.json({
            message: 'User Soft Deleted',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                deleted: user.deleted,
                role: user.role ? user.role.name : null // Include the role name
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// Restore a soft-deleted user (Admin only)
exports.restoreUser = async (req, res) => {
    try {
        // Fetch the user including the associated role
        const user = await User.findByPk(req.params.id, {
            include: [{
                model: Role,
                as: 'role', // Ensure the alias matches
                attributes: ['name'] // Specify the attributes you want to include
            }]
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update the user to set 'deleted' to false
        await user.update({ deleted: false });

        res.json({
            message: 'User restored',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                deleted: user.deleted,
                role: user.role ? user.role.name : null // Include the role name
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Permanently delete a user (Admin only)
exports.permanantDeleteUser = async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findByPk(req.params.id, {
            include: [{
                model: Role,
                as: 'role', // Ensure the alias matches
                attributes: ['name'] // Specify the attributes you want to include
            }]
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Delete the user from the database permanently
        await user.destroy();

        res.json({
            message: 'User permanently deleted',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                deleted: user.deleted, // This will be undefined since the user is deleted
                role: user.role ? user.role.name : null // Include the role name
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
