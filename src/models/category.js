const db = require('../config/database');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

class Category {
    // Lấy tất cả danh mục
    static async findAll() {
        try {
            return await query(`
                SELECT c.*, pc.category_name as parent_name 
                FROM categories c
                LEFT JOIN categories pc ON c.parent_category_id = pc.category_id
            `);
        } catch (error) {
            throw error;
        }
    }

    // Lấy danh mục theo ID
    static async findById(id) {
        try {
            const result = await query(`
                SELECT c.*, pc.category_name as parent_name 
                FROM categories c
                LEFT JOIN categories pc ON c.parent_category_id = pc.category_id
                WHERE c.category_id = ?
            `, [id]);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    // Lấy các danh mục con theo danh mục cha
    static async findByParentId(parentId) {
        try {
            return await query('SELECT * FROM categories WHERE parent_category_id = ?', [parentId]);
        } catch (error) {
            throw error;
        }
    }

    // Lấy các danh mục gốc (không có danh mục cha)???
    static async findRootCategories() {
        try {
            return await query('SELECT * FROM categories WHERE parent_category_id IS NULL');
        } catch (error) {
            throw error;
        }
    }

    // Tạo danh mục mới
    static async create(categoryData) {
        try {
            const { category_name, parent_category_id = null } = categoryData;
            const result = await query(
                'INSERT INTO categories (category_name, parent_category_id) VALUES (?, ?)', 
                [category_name, parent_category_id]);
            return { 
                category_id: result.insertId, 
                category_name, 
                parent_category_id 
            };
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật danh mục
    static async update(id, categoryData) {
        try {
            await query('UPDATE categories SET ? WHERE category_id = ?', [categoryData, id]);
            return { category_id: id, ...categoryData };
        } catch (error) {
            throw error;
        }
    }

    // Xóa danh mục
    static async delete(id) {
        try {
            return await query('DELETE FROM categories WHERE category_id = ?', [id]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Category;