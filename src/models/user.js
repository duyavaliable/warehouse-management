const db = require('../config/database');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);
const bcrypt = require('bcrypt');

class User {
    // Get all users
    static async findAll() {
        try {
            return await query('SELECT user_id, username, fullname, email, role_id, is_active, created_at, updated_at FROM users');
        } catch (error) {
            throw error;
        }
    }

    // Get a user by ID
    static async findById(id) {
        try {
            const result = await query(
                'SELECT user_id, username, fullname, email, role_id, is_active, created_at, updated_at FROM users WHERE user_id = ?', 
                [id]
            );
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    // Create a new user
    static async create(userData) {
        try {
            // // Hash the password
            // if (userData.password) {
            //     const salt = await bcrypt.genSalt(10);
            //     userData.password = await bcrypt.hash(userData.password, salt);
            // }
            
            // Add timestamps
            userData.created_at = new Date();
            userData.updated_at = new Date();
            
            const result = await query('INSERT INTO users SET ?', userData);
            const { password, ...userWithoutPassword } = userData;
            return { user_id: result.insertId, ...userWithoutPassword };
        } catch (error) {
            throw error;
        }
    }

    // Update a user
    static async update(user_id, userData) {
        try {
            // // Hash the password if it's being updated
            // if (userData.password) {
            //     const salt = await bcrypt.genSalt(10);
            //     userData.password = await bcrypt.hash(userData.password, salt);
            // }
            
            // Update timestamp
            userData.updated_at = new Date();
            
            await query('UPDATE users SET ? WHERE user_id = ?', [userData, user_id]);
            const { password, ...userWithoutPassword } = userData;
            return { user_id, ...userWithoutPassword };
        } catch (error) {
            throw error;
        }
    }

    // Delete a user
    static async delete(user_id) {
        try {
            return await query('DELETE FROM users WHERE user_id = ?', [user_id]);
        } catch (error) {
            throw error;
        }
    }
    
    // Find by email (for authentication)
    static async findByEmail(email) {
        try {
            const result = await query('SELECT * FROM users WHERE email = ?', [email]);
            return result[0];
        } catch (error) {
            throw error;
        }
    }
}
module.exports = User;