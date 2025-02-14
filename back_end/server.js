const express = require('express');
const cors = require('cors');
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(
    cors({
        origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // Chỉ định origin được phép truy cập
        credentials: true, // Cho phép gửi cookie hoặc session
    })
);

const connectDB = require('./myModule/database/connectDB.js')
const { authenticateJWT, authenticateADMIN } = require('./myModule/Utils/JWT.js')

// IMPORT MODULE

const changePassword = require('./myModule/database/user/changePassword.js');
const checkUserName = require('./myModule/database/user/checkUserName.js');
<<<<<<< HEAD
const { GetUserInfo, GetUserInfo_Admin } = require('./myModule/database/user/getUserInfo.js');
const { resetPassword, verification } = require('./myModule/controller/resetpassword.js');
const Register = require('./myModule/controller/register.js');
const { AuthGoogle, Auth } = require('./myModule/controller/Login.js');
const { getUserList, getTotalUserCount } = require('./myModule/controller/UserListControl.js')
=======
const getUserInfo = require('./myModule/database/user/getUserInfo.js');
const { resetPassword, verification } = require('./myModule/controller/resetpassword.js');
const register = require('./myModule/controller/register.js');
const { AuthGoogle, Auth } = require('./myModule/controller/Login.js');
const getServiceDetail = require('./myModule/database/user/getServiceDetail.js');
const getServiceTypeDetail = require('./myModule/database/user/getServiceTypeDetail.js');
>>>>>>> 50983424e4164c2181af19be10ed90b620606753

// ----------------------------------------------------------

// CREATE API

// user
app.post('/changePassword', changePassword);
app.post('/checkUserName', checkUserName);
app.post('/getUserInfo', authenticateJWT, getUserInfo);
app.post('/resetPassword', resetPassword);
app.post('/verification', verification);
app.post('/register', register);
app.post('/auth/google/login', AuthGoogle);
app.post('/auth/login', Auth);
<<<<<<< HEAD
// admin
app.post('/CustomerManager/getUserList', authenticateADMIN, getUserList);
app.post('/CustomerManager/getTotelUserCount', authenticateADMIN, getTotalUserCount);
app.post('/CustomerManager/getUserInfo', authenticateADMIN, GetUserInfo_Admin);
=======
app.post('/getServiceDetail', getServiceDetail);
app.post('/getServiceTypeDetail', getServiceTypeDetail);

>>>>>>> 50983424e4164c2181af19be10ed90b620606753

// ----------------------------------------------------------

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    (async () => { global.pool = await connectDB() })();
});
