const express = require('express');
const cors = require('cors');
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors());
const connectDB = require('./myModule/database/connectDB.js')

// IMPORT MODULE

const sendMail = require('./myModule/Utils/mail.js');
const changePassword = require('./myModule/database/user/changePassword.js');
const CheckAccountExist = require('./myModule/database/user/checkAccExist.js');
const CheckEmail = require('./myModule/database/user/checkEmail.js');
const GetUserInfo = require('./myModule/database/user/getUserInfo.js');
const ResetPassword = require('./myModule/controller/resetpassword.js');
const Register = require('./myModule/controller/register.js');

// ----------------------------------------------------------

// CREATE API

app.post('/sendMail', sendMail);
app.post('/changePassword', changePassword);
app.post('/checkAccountExist', CheckAccountExist);
app.post('/checkEmail', CheckEmail);
app.post('/getUserInfo', GetUserInfo);
app.post('/resetPassword', ResetPassword);
app.post('/register', Register);


// ----------------------------------------------------------

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    (async () => { global.pool = await connectDB() })();
});
