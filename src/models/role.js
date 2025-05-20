const db = require('../config/database');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

class Role {
    // Get all roles
    static async findAll() {
        try {
            return await query('SELECT * FROM roles');
        } catch (error) {
            throw error;
        }
    }

    // Get a role by ID
    static async findById(role_id) {
        try {
            const result = await query('SELECT * FROM roles WHERE role_id = ?', [role_id]);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    // Create a new role
    static async create(roleData) {
        try {
            const result = await query('INSERT INTO roles SET ?', roleData);
            return { role_id: result.insertId, ...roleData };
        } catch (error) {
            throw error;
        }
    }

    // Update a role
    static async update(role_id, roleData) {
        try {
            await query('UPDATE roles SET ? WHERE role_id = ?', [roleData, role_id]);
            return { role_id, ...roleData };
        } catch (error) {
            throw error;
        }
    }

    // Delete a role
    static async delete(role_id) {
        try {
            return await query('DELETE FROM roles WHERE role_id = ?', [role_id]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Role;