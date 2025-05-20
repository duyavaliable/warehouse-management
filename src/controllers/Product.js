const Product = require('../models/product');

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
        max_stock_level
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
            status: 'active', 
            created_at: new Date(),
            updated_at: new Date()
        });
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
        max_stock_level
    } = req.body;

    try {
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

        // Loại bỏ các trường undefined
        Object.keys(productData).forEach(key => 
            productData[key] === undefined && delete productData[key]
        );

        const updatedProduct = await Product.update(id, productData);
        res.status(200).json(updatedProduct);
    } catch (error) {
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