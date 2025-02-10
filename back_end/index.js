const express = require('express');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');

// Tạo ứng dụng Express
const app = express();
const CLIENT_ID = '337733600812-vk80tkmu5juol3ovt4mc11vabpo10vn2.apps.googleusercontent.com'; // Thay bằng Client ID thực tế của bạn
const client = new OAuth2Client(CLIENT_ID);

const cors = require('cors');
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Thay bằng URL của Front-end
}));

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Phục vụ file tĩnh (index.html)

// API: Xử lý đăng nhập
app.post('/api/login', async (req, res) => {
    const { token } = req.body;
    console.log('token:', token)
    if (!token) {
        return res.status(400).json({ success: false, message: 'Token is required' });
    }

    try {
        // Xác thực token với Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();

        console.log(payload)

        // Lấy thông tin người dùng từ token
        const user = {
            google_id: payload.sub, // ID duy nhất từ Google
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
        };

        console.log('User Info:', user);

        // TODO: Lưu thông tin người dùng vào cơ sở dữ liệu (nếu cần)

        // Trả kết quả thành công
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ success: false, message: 'Invalid token' });
    }
});

// Trang hiển thị sau đăng nhập
app.get('/success', (req, res) => {
    res.send('<h1>Đăng nhập thành công!</h1><a href="/">Quay lại trang chủ</a>');
});

// Khởi chạy server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
