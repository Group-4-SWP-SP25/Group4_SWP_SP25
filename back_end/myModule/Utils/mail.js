const nodemailer = require('nodemailer')
const fs = require('fs');
const { generateVerificationCode } = require('../Utils/verificationcode')
const findUserById = require('../database/user/findUserById')

const send = async (req, res) => {
    // read template
    let template = fs.readFileSync('./myModule/Utils/mail_Template.html', 'utf-8')
    // inf
    const { id } = req.body;
    const user = await findUserById(id);
    const email = user.email;
    const code = generateVerificationCode(email);
    console.log(code)

    const replacements = { username: user.firstName + " " + user.lastName, code: code };
    // 
    for (const key in replacements) {
        if (replacements.hasOwnProperty(key)) {
            const value = replacements[key];
            const pattern = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(pattern, value);
        }
    }
    //
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hieudmhe182298@fpt.edu.vn',
            pass: 'ygbt nywx dvax cpkf'
        }
    });

    let mailOptions = {
        from: 'hieudmhe182298@fpt.edu.vn',
        to: email,
        subject: 'Hello from Node.js!',
        html: template
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
}

module.exports = send