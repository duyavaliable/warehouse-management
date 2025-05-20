const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    const { id: user_id } = req.params;
    try {
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    const { username, fullname, password, email, role_id, is_active } = req.body;
    try {
        const newUser = await User.create({
            username,
            fullname,
            password,
            email,
            role_id,
            is_active: is_active || true
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    const { id: user_id } = req.params;
    const { username, fullname, password, email, role_id, is_active } = req.body;
    try {
        const userData = { username, fullname, email, role_id, is_active };
        
        // Only include password if it's provided
        if (password) {
            userData.password = password;
        }

        const updatedUser = await User.update(user_id, userData);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const { id: user_id } = req.params;
    try {
        await User.delete(user_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    let user;
    
    try {
        // Find user by email
        user = await User.findByEmail(email);

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Thong tin dang nhap khong hop le' });
        }
        
        // Check if user is active
        if (!user.is_active) {
            return res.status(401).json({ message: 'Tai khoan khong hoat dong' });
        }

         // Compare passwords
        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = password === user.password; 
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Thong tin dang nhap khong hop le' });
        }

        // Create and sign JWT token
        const token = jwt.sign(
            { id: user.user_id, username: user.username, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        res.status(200).json({
            user: {
                id: user.user_id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                role_id: user.role_id,
                is_active: user.is_active
            },
            token
         });
    } catch (error) {
        res.status(500).json({ message: 'Loi trong qua trinh dang nhap', error: error.message });
    }
};

// User registration
exports.register = async (req, res) => {
    const { username, fullname, password, email, role_id } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email da ton tai' });
        }
        
        // Hash password
        // const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = await User.create({
            username,
            fullname,
            // password: hashedPassword,
            password,
            email,
            role_id,
            is_active: true
        });
        
        // Create and sign JWT token
        const token = jwt.sign(
            { id: newUser.user_id, username: newUser.username, role_id: newUser.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Send response
        res.status(201).json({
            user: {
                id: newUser.user_id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                role_id: newUser.role_id,
                is_active: newUser.is_active
            },
            token
        });

    } catch (error) {
        res.status(500).json({ message: 'Loi trong qua trinh dang ky', error: error.message });
    }
};

// Check authentication status
exports.checkAuthStatus = async (req, res) => {
    try {
        // Nếu middleware auth đã xác thực thành công, req.user sẽ tồn tại
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        
        res.status(200).json({
            user: {
                id: user.user_id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                role_id: user.role_id,
                is_active: user.is_active
            },
            authenticated: true
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi kiểm tra trạng thái xác thực', 
            error: error.message,
            authenticated: false 
        });
    }
};