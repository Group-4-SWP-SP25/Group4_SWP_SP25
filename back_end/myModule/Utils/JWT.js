const jwt = require('jsonwebtoken');
const SECRET_KEY = 'doan-minh-hieu'; // Thay bằng khóa bí mật của bạn

// Tạo JWT
function generateToken(user) {
    return jwt.sign(
        { id: user.id, name: user.name, role: user.role }, // Payload
        SECRET_KEY, // Khóa bí mật
        { expiresIn: '24h' } // Thời gian hết hạn (24 giờ)
    );
}

// Giải mã và xác thực JWT
function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY); // Giải mã token
    } catch (err) {
        return null; // Token không hợp lệ
    }
}

function authenticateJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ Header

    if (!token) {
        return res.status(403).json({ success: false, message: 'Token is required' });
    }

    try {
        const user = jwt.verify(token, SECRET_KEY); // Giải mã token
        req.user = user; // Gắn thông tin người dùng vào req
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}

module.exports = {
    generateToken,
    verifyToken,
    authenticateJWT
};