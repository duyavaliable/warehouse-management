const Product = require('../models/product');
const db = require('../config/database');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

// Lấy tất cả sản phẩm
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
    }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin sản phẩm', error: error.message });
    }
};

// Tìm kiếm sản phẩm
exports.searchProducts = async (req, res) => {
    const { keyword } = req.query;
    try {
        const products = await Product.search(keyword);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm kiếm sản phẩm', error: error.message });
    }
};

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
    const { 
        name, 
        sku, 
        description,
        category_id, 
        unit_of_measure,
        selling_price, 
        cost_price,
        min_stock_level,
        max_stock_level,
        current_stock
    } = req.body;

    try {
        const newProduct = await Product.create({
            name,
            sku,
            description,
            category_id,
            unit_of_measure,
            selling_price,
            cost_price,
            min_stock_level,
            max_stock_level,
            // status: 'active', 
            created_at: new Date(),
            updated_at: new Date()
        });

        //tao ban ghi ton kho
        await query (`
            INSERT INTO inventory (product_id, current_stock ) VALUES (?, ?)
        `, [newProduct.product_id, current_stock || 0]);

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo sản phẩm mới', error: error.message });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { 
        name, 
        sku, 
        description,
        category_id,
        unit_of_measure, 
        selling_price, 
        cost_price,
        min_stock_level,
        max_stock_level,
        current_stock
    } = req.body;

    try {
        // Bắt đầu transaction
        await query('START TRANSACTION');

        const productData = {
            name,
            sku,
            description,
            category_id,
            unit_of_measure,
            selling_price,
            cost_price,
            min_stock_level,
            max_stock_level,
            updated_at: new Date()
        };
        
        // Kiểm tra nếu admin cố gắng đánh dấu sản phẩm hết hàng thành còn hàng
        if (req.body.status === 'instock') {
            // Kiểm tra tồn kho trong inventory
            const stockInfo = await query(
                'SELECT current_stock FROM inventory WHERE product_id = ?', 
                [id]
            );
            
            if (stockInfo[0] && stockInfo[0].current_stock <= min_stock_level) {
                await query('ROLLBACK');
                return res.status(400).json({ 
                    message: 'Không thể đánh dấu là còn hàng khi số lượng tồn kho <= mức tối thiểu' 
                });
            }
        }

        // Loại bỏ các trường undefined
        Object.keys(productData).forEach(key => 
            productData[key] === undefined && delete productData[key]
        );

        const updateResult = await Product.update(id, productData);

        // Cập nhật tồn kho nếu có thay đổi
        if (current_stock !== undefined) {
            await query(
                'UPDATE inventory SET current_stock = ? WHERE product_id = ?',
                [current_stock, id]
            );
        }
        
                // Commit transaction
        await query('COMMIT');
        
        // Lấy sản phẩm đã cập nhật với thông tin tồn kho
        const updatedProduct = await query(`
            SELECT p.*, i.current_stock 
            FROM products p
            LEFT JOIN inventory i ON p.product_id = i.product_id
            WHERE p.product_id = ?
        `, [id]);

        res.status(200).json(updatedProduct[0]);
    } catch (error) {
        await query('ROLLBACK');
        res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await Product.delete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: error.message });
    }
};

// Lọc sản phẩm theo danh mục
exports.filterByCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const products = await Product.filterByCategory(categoryId);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lọc sản phẩm theo danh mục', error: error.message });
    }
};

// Lọc sản phẩm theo mức tồn kho
exports.filterByStockLevel = async (req, res) => {
    const { minLevel, maxLevel } = req.query;
    try {
        const products = await Product.filterByStockLevel(minLevel, maxLevel);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lọc sản phẩm theo mức tồn kho', error: error.message });
    }
};

// Lọc sản phẩm theo đơn vị tính
exports.filterByUnitOfMeasure = async (req, res) => {
    const { unit } = req.params;
    try {
        const products = await Product.filterByUnitOfMeasure(unit);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lọc sản phẩm theo đơn vị tính', error: error.message });
    }
};

exports.filterByStatus = async (req, res) => {
    const { status } = req.params;
    try {
        // Bạn cần thêm phương thức này vào Product model
        const products = await Product.filterByStatus(status);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lọc sản phẩm theo trạng thái', error: error.message });
    }
};