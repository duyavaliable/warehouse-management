const Category = require('../models/category');

// Lấy tất cả danh mục
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh mục', error: error.message });
    }
};

// Lấy danh mục theo ID
exports.getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh mục', error: error.message });
    }
};

// Lấy danh mục con theo danh mục cha
exports.getCategoriesByParentId = async (req, res) => {
    const { parentId } = req.params;
    try {
        const categories = await Category.findByParentId(parentId);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh mục con', error: error.message });
    }
};

// Lấy danh mục gốc (không có danh mục cha)???
exports.getRootCategories = async (req, res) => {
    try {
        const rootCategories = await Category.findRootCategories();
        res.status(200).json(rootCategories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh mục gốc', error: error.message });
    }
};

// Tạo danh mục mới
exports.createCategory = async (req, res) => {
    const {  category_name, parent_category_id } = req.body;
    try {
        const newCategory = await Category.create({ 
            category_name, 
            parent_category_id,
        });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo danh mục', error: error.message });
    }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const {  category_name, parent_category_id } = req.body;
    try {
        const updatedCategory = await Category.update(id, { 
            category_name, 
            parent_category_id,
           
        });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật danh mục', error: error.message });
    }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await Category.delete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa danh mục', error: error.message });
    }
};