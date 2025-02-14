const addUser = require('../database/user/addUser.js');
const checkUserName = require('../database/user/checkUserName.js');

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address, username, password } = req.body;

        // Check email existence
        let user1 = await checkUserName(req.body.email);
        if (user1 != null) {
            console.log('Email already exists!');
            return res.status(400).json({ error: "Email already exists!" });
        }
        let user2 = await checkUserName(req.body.username);
        if (user2 != null) {
            console.log('Username already exists!');
            return res.status(400).json({ error: "Username already exists!" });
        }
        // Add user
        if (await addUser(req.body) == 1) {
            console.log('Add user successfully.');
            return res.status(200);
        } else {
            console.log('Add user error.');
            return res.status(400);
        }
    } catch { }
};

module.exports = register;
