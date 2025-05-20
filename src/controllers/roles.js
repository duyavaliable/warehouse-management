const Role = require('../models/role');

// Get all roles
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving roles', error: error.message });
    }
};

// Get a role by ID
exports.getRoleById = async (req, res) => {
    const { id: role_id } = req.params;
    try {
        const role = await Role.findById(role_id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving role', error: error.message });
    }
};

// Create a new role
exports.createRole = async (req, res) => {
    const { role_name, permissions } = req.body;
    try {
        const newRole = await Role.create({ role_name, permissions });
        res.status(201).json(newRole);
    } catch (error) {
        res.status(500).json({ message: 'Error creating role', error: error.message });
    }
};

// Update a role
exports.updateRole = async (req, res) => {
    const { id: role_id } = req.params;
    const { role_name, permissions } = req.body;
    try {
        const updatedRole = await Role.update(role_id, { role_name, permissions });
        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(500).json({ message: 'Error updating role', error: error.message });
    }
};

// Delete a role
exports.deleteRole = async (req, res) => {
    const { id: role_id } = req.params;
    try {
        await Role.delete(role_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting role', error: error.message });
    }
};