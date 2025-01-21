//
const checkAccountExist = require('../database/user/checkAccExist.js');
const checkEmail = require('../database/user/checkEmail.js');
const addUser = require('../database/user/addUser.js');
const { response, request } = require('express');

//
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address, username, password } = req.body;
        // console.log(req.body);
        // console.log('Step 1');

        // Check email existence
        fetch('http://localhost:3000/checkEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account: email
            })
        })
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                if (result.id != -1) {
                    return res.status(400);
                }
                console.log(result.id);
            });
        // console.log('Step 2');

        // Check username existance
        fetch('http://localhost:3000/checkEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account: username
            })
        })
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                if (result.id != -1) {
                    return res.status(400);
                }
                console.log(result.id);
            });
        // console.log('Step 3');

        // Add user
        user = {
            UserID: 0,
            UserName: username,
            Password: password,
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Address: address,
            Role: 'User',
            Phone: phone
        };
        if (addUser(user) == 1) {
            return res.status(200);
        } else {
            return res.status(400);
        }
    } catch {}
};

module.exports = register;
