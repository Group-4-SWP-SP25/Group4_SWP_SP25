const { OAuth2Client } = require('google-auth-library');
const { generateToken } = require('../Utils/JWT');
const checkUserName = require('../database/user/checkUserName');

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
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();

        // Lấy thông tin người dùng từ token
        const userGG = {
            google_id: payload.sub, // ID duy nhất từ Google
            email: payload.email,
            name: payload.name,
            picture: payload.picture
        };
        console.log('WELCOME ', userGG.name);

        // get user info
        const user = await checkUserName(userGG.email);
        if (user == null) {
            res.json({ success: true, isExist: false, email: payload.email });
        } else {
            const token = generateToken({
                id: user.UserID,
                name: user.FirstName,
                role: user.Role
            });
            res.json({ success: true, isExist: true, token });
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ success: false, message: 'Invalid token' });
    }
};

const Auth = async (req, res) => {
    const { account, password } = req.body;
    const user = await checkUserName(account);
    if (user == null) {
        res.status(404).json({ message: 'Account not found' });
    } else if (password == user.Password) {
        const token = generateToken({ id: user.UserID, name: user.FirstName, role: user.Role });
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: 'Wrong password' });
    }
};

module.exports = {
    AuthGoogle,
    Auth
};
