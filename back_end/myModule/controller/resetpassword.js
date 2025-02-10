// const findUserById = require('../database/user/findUserById')
const { response } = require('express');
const checkUserName = require('../database/user/checkUserName')
const { getVerificationCode } = require('../Utils/verificationcode')
const sendMail = require('../Utils/mail')

// check account
const resetPassword = async (req, res) => {
    const { account } = req.body;
    const userData = await checkUserName(account)
    if (userData == null) {
        return res.status(404).json({ message: 'Account not found' });
    } else {
        sendMail(userData.FirstName + ' ' + userData.LastName, userData.Email);
        return res.status(200).json({ message: 'Email sent' })
    }
}

//check verifycation code
const verification = async (req, res) => {
    const { username, code } = req.body;
    checkUserName(username)
        .then(userData => {
            const verification = getVerificationCode(userData.Email);
            if (!verification) {
                return res.status(400).send('Invalid code.');
            } // Kiểm tra thời gian hết hạn 
            if (verification.expires < Date.now()) {
                return res.status(400).send('Code expired.');
            }
            if (verification.code !== code) {
                return res.status(400).send('Invalid code.');
            }
            res.send('Email verified successfully.')
        })
}

module.exports = {
    resetPassword,
    verification
};