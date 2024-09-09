const { Project, User, Role } = require('../models'); // Import your models

// Create a new project (Admin only)
exports.createProject = async (req, res) => {
    try {
        // Extract project data from request body
        const { name, description, assignedTo } = req.body;

        // Ensure assigned users are only managers
        const assignedUsers = await User.findAll({
            where: { id: assignedTo },
            include: [{ model: Role, as: 'role' }] // Ensure role association is included
        });

        if (assignedUsers.length !== assignedTo.length) {
            return res.status(400).json({ message: 'One or more assigned users not found' });
        }

        const nonManagers = assignedUsers.filter(user => user.role.name !== 'Manager');
        if (nonManagers.length > 0) {
            return res.status(400).json({ message: 'Only managers can be assigned to a project' });
        }

        // Automatically set the creator to the admin making the request
        const createdBy = req.user.id; // Assuming `req.user` is set by your authentication middleware

        // Create the project
        const project = await Project.create({
            name,
            description,
            createdBy,
            assignedTo,
        });

        res.status(201).json({
            message: 'Project created successfully',
            project: {
                id: project.id,
                name: project.name,
                description: project.description,
                createdBy: req.user.id, // Automatically set creator
                assignedTo: project.assignedTo,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get projects (Role-based access)
exports.getProjects = async (req, res) => {
    try {
        let projects = [];
        if (req.user.role === 'Admin') {
            projects = await Project.findAll(); // Admin can see all projects
        } else if (req.user.role === 'Manager') {
            projects = await Project.findAll({ where: { managerId: req.user.id } }); // Manager sees assigned projects
        } else if (req.user.role === 'Employee') {
            projects = await Project.findAll({ 
                include: {
                    model: User,
                    where: { id: req.user.id } // Employee sees assigned projects
                }
            });
        }
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a specific project by ID (All users)
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a project (Admin only)
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        await project.update(req.body);
        res.json({ message: 'Project updated', project });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Soft delete a project (Admin only)
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        await project.update({ deleted: true });
        res.json({ message: 'Project soft deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Restore a soft-deleted project (Admin only)
exports.restoreProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        await project.update({ deleted: false });
        res.json({ message: 'Project restored' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
