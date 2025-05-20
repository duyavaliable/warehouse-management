const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const verifyToken = promisify(jwt.verify);

const authMiddleware = async (req, res, next) => {
    // Lấy header authorization
    const authHeader = req.headers['authorization'];
    
    // Kiểm tra xem header auth có tồn tại và có đúng định dạng không
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Không có token hoặc định dạng không hợp lệ' });
    }
    
    // Trích xuất token
    const token = authHeader.split(' ')[1];

    try {
        const decoded = await verifyToken(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Không được phép', error: error.message });
    }
};

module.exports = {
    authMiddleware,
};