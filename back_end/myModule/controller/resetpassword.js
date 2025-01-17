const findUserById = require('../database/user/findUserById')
const { getVerificationCode } = require('../Utils/verificationcode')

// check verify code
const resetPassword = (req, res) => {
    const { id, code } = req.body;
    findUserById(id)
        .then(user => {
            const verification = getVerificationCode(user.email);
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