const { OAuth2Client } = require('google-auth-library');
const { generateToken } = require('../Utils/JWT');

const CLIENT_ID = '337733600812-vk80tkmu5juol3ovt4mc11vabpo10vn2.apps.googleusercontent.com'; // Thay bằng Client ID thực tế của bạn
const client = new OAuth2Client(CLIENT_ID);

const AuthGoogle = async (req, res) => {
    const { token } = req.body;
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

        // Lấy thông tin người dùng từ token
        const user = {
            google_id: payload.sub, // ID duy nhất từ Google
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
        };
        console.log('WELCOME ', user.name)

        // Get JWT

        token = generateToken({ id: user.google_id, email: user.email })

        // Trả kết quả thành công
        res.json({ success: true, token });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ success: false, message: 'Invalid token' });
    }
};

const Auth = async (req, res) => {

}

module.exports = AuthGoogle;