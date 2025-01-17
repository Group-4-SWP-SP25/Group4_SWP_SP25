const send = require('../Utils/mail')
const findUserById = require('../database/user/findUserById')
const { getVerificationCode } = require('../Utils/verificationcode')

// 
const resetPassword = (req, res) => {
    const { id, code } = req.body;
    findUserById(id)
        .then(user => {
            send(user.email, user.firstName + ' ' + user.lastName);
            const verification = getVerificationCode(user.email).code;

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

module.exports = resetPassword