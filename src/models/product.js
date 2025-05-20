const db = require('../config/database');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

class Product {
    // Lấy tất cả sản phẩm với thông tin danh mục
    static async findAll() {
        try {
            return await query(`
                SELECT p.*, c.category_name 
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                ORDER BY p.created_at DESC
            `);
        } catch (error) {
            throw error;
        }
    }

    // Lấy sản phẩm theo ID
    static async findById(id) {
        try {
            const result = await query(`
                SELECT p.*, c.category_name 
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE p.product_id = ?
            `, [id]);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    // Tìm kiếm sản phẩm
    static async search(keyword) {
        try {
            return await query(`
                SELECT p.*, c.category_name 
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE 
                    p.name LIKE ? OR 
                    p.sku LIKE ? OR
                    p.description LIKE ?
            `, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]);
        } catch (error) {
            throw error;
        }
    }

    // Tạo sản phẩm mới
    static async create(productData) {
        try {
            const result = await query('INSERT INTO products SET ?', productData);
            return { product_id: result.insertId, ...productData };
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật sản phẩm
    static async update(id, productData) {
        try {
            await query('UPDATE products SET ? WHERE product_id = ?', [productData, id]);
            return { product_id: id, ...productData };
        } catch (error) {
            throw error;
        }
    }

    // Xóa sản phẩm
    static async delete(id) {
        try {
            return await query('DELETE FROM products WHERE product_id = ?', [id]);
        } catch (error) {
            throw error;
        }
    }

    // Lọc sản phẩm theo danh mục
    static async filterByCategory(categoryId) {
        try {
            return await query(`
                SELECT p.*, c.category_name 
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE p.category_id = ?
            `, [categoryId]);
        } catch (error) {
            throw error;
        }
    }

    // Lọc sản phẩm theo muc ton kho
    static async filterByStockLevel(minLevel, maxLevel) {
        try {
            let sql = `
                SELECT p.*, c.category_name 
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE 1=1
            `;
            
            const params = [];
            
            if (minLevel !== undefined) {
                sql += ` AND p.min_stock_level >= ?`;
                params.push(minLevel);
            }
            
            if (maxLevel !== undefined) {
                sql += ` AND p.max_stock_level <= ?`;
                params.push(maxLevel);
            }
            
            return await query(sql, params);
        } catch (error) {
            throw error;
        }
    }

    //phương thức lọc theo đơn vị tính
    static async filterByUnitOfMeasure(unit) {
        try {
            return await query(`
                SELECT p.*, c.category_name 
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE p.unit_of_measure = ?
            `, [unit]);
        } catch (error) {
            throw error;
        }
    }

    //phương thức lọc theo trạng thái
    static async filterByStatus(status) {
        try {
            let sql;
            if (status === 'instock') {
                // Sản phẩm có tồn kho lớn hơn mức tối thiểu
                sql = `
                    SELECT p.*, c.category_name 
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.category_id
                    // WHERE p.current_stock > p.min_stock_level
                    WHERE p.stock_quantity > p.min_stock_level
                `;
            } else if (status === 'outofstock') {
                // Sản phẩm có tồn kho nhỏ hơn hoặc bằng mức tối thiểu
                sql = `
                    SELECT p.*, c.category_name 
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.category_id
                    // WHERE p.current_stock <= p.min_stock_level
                    WHERE p.stock_quantity <= p.min_stock_level
                `;
            }
            return await query(sql);
        } catch (error) {
            throw error;
        }
    }
}
module.exports = Product;