const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = '337733600812-vk80tkmu5juol3ovt4mc11vabpo10vn2.apps.googleusercontent.com'; // Thay bằng Client ID của bạn
const GOOGLE_CLIENT_SECRET = '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'; // Thay bằng Client Secret của bạn

const express = require('express');
const router = express.Router();

router.use(
    session({
        secret: 'doan-minh-hieu',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Đặt true nếu dùng HTTPS
            httpOnly: true,
            maxAge: 1000 * 60 * 60, // 1 hour
            sameSite: 'none'
        },
    })
);

router.use(passport.initialize());
router.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
},
    (request, accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }
));


passport.serializeUser((user, done) => {
    done(null, user)
});
passport.deserializeUser((user, done) => {
    done(null, user)
});

router.get('/auth/google/login',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback sau khi đăng nhập thành công
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        const user = req.user;
        // Redirect về client kèm thông tin cần thiết
        res.redirect(`http://127.0.0.1:5500/front_end/Login/Login.html?name=${user.displayName}&email=${user.emails[0].value}&id=${user.id}`);
    }
);

// Route đăng xuất
router.get('/auth/google/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send('Không thể đăng xuất');
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Không thể hủy session');
            }
            res.redirect('/');
        });
    });
});

// router.get('/user', (req, res) => {
//     //console.log('Session:', req.session); // Log session
//     console.log('User:', req.user); // Log user
//     console.log(req.isAuthenticated())
//     if (req.isAuthenticated()) {
//         console.log('da dang nhap')
//         res.json({
//             success: true,
//             id: req.user.id, // Thông tin người dùng được lưu bởi Passport.js
//         });
//     } else {
//         console.log('chua dang nhap')
//         res.status(401).json({
//             success: false,
//             message: 'User not authenticated',
//         });
//     }
// });

module.exports = router