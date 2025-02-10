const jwt = require('jsonwebtoken');
const SECRET_KEY = 'doan-minh-hieu'; // Thay bằng khóa bí mật của bạn

// Tạo JWT
function generateToken(user) {
    return jwt.sign(
        { userId: user.id, email: user.email }, // Payload
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

module.exports = {
    generateToken,
    verifyToken,
};