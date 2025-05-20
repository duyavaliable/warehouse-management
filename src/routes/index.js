const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const usersController = require('../controllers/users');
const rolesController = require('../controllers/roles');
const productsController = require('../controllers/Product');
const categoriesController = require('../controllers/categories');

// Routes  cần xác thực
router.post('/auth/login', usersController.login);
router.post('/auth/register', usersController.register);
router.get('/auth/status', authMiddleware, usersController.checkAuthStatus);

// Routes người dùng (cần xác thực)
router.get('/users', authMiddleware, usersController.getUsers);
router.get('/users/:id', authMiddleware, usersController.getUserById);
router.post('/users', authMiddleware, usersController.createUser);
router.put('/users/:id', authMiddleware, usersController.updateUser);
router.delete('/users/:id', authMiddleware, usersController.deleteUser);

// Routes vai trò (cần xác thực)
router.get('/roles', authMiddleware, rolesController.getRoles);
router.get('/roles/:id', authMiddleware, rolesController.getRoleById);
router.post('/roles', authMiddleware, rolesController.createRole);
router.put('/roles/:id', authMiddleware, rolesController.updateRole);
router.delete('/roles/:id', authMiddleware, rolesController.deleteRole);

// Routes sản phẩm (cần xác thực)
router.get('/products', authMiddleware, productsController.getProducts);
router.get('/products/search', authMiddleware, productsController.searchProducts);
router.get('/products/categories/:categoryId', authMiddleware, productsController.filterByCategory);
router.get('/products/status/:status', authMiddleware, productsController.filterByStatus);
router.get('/products/:id', authMiddleware, productsController.getProductById);
router.post('/products', authMiddleware, productsController.createProduct);
router.put('/products/:id', authMiddleware, productsController.updateProduct);
router.delete('/products/:id', authMiddleware, productsController.deleteProduct);

// Routes danh mục (cần xác thực)
router.get('/categories/:id', authMiddleware, categoriesController.getCategoryById);
router.get('/categories', authMiddleware, categoriesController.getCategories);
router.post('/categories', authMiddleware, categoriesController.createCategory);
router.put('/categories/:id', authMiddleware, categoriesController.updateCategory);
router.delete('/categories/:id', authMiddleware, categoriesController.deleteCategory);
router.get('/categories/parent/:parentId', authMiddleware, categoriesController.getCategoriesByParentId);
router.get('/categories/root', authMiddleware, categoriesController.getRootCategories);

module.exports = router;

