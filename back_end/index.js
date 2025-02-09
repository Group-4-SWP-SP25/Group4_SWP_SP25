const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Cấu hình session
app.use(session({
    secret: 'your-secret-key', // Thay bằng một chuỗi bí mật
    resave: false,
    saveUninitialized: true,
}));

// Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());

// Cấu hình Passport với Google OAuth 2.0
const GOOGLE_CLIENT_ID = '337733600812-vk80tkmu5juol3ovt4mc11vabpo10vn2.apps.googleusercontent.com'; // Thay bằng Client ID của bạn
const GOOGLE_CLIENT_SECRET = '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'; // Thay bằng Client Secret của bạn

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},
    (accessToken, refreshToken, profile, done) => {
        // Lưu thông tin người dùng vào session
        return done(null, profile);
    }));

// Serialize và Deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Route đăng nhập bằng Google
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback sau khi đăng nhập thành công
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Đăng nhập thành công, chuyển hướng đến trang chính
        res.redirect('/');
    });

// Route trang chủ
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Xin chào, ${req.user._json.sub}! <a href="/logout">Đăng xuất</a>`);
    } else {
        res.send('<a href="/auth/google">Đăng nhập bằng Google</a>');
    }
});

// Route đăng xuất
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send('Không thể đăng xuất');
        }
        res.redirect('/');
    });
});

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên http://localhost:${PORT}`);
});