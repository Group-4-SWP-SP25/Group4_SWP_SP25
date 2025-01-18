// server
const CheckAccountExist = require('../database/user/checkAccExist')


const Login = (req, res) => {
    // check account exist
    let user = CheckAccountExist(req.body);
    // 

}