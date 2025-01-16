const nodemailer = require('nodemailer')
const fs = require('fs')
const express = require('express');
const router = express.Router()

const emailTemplate = fs.readFileSync('./myModule/mail_Template.html','utf-8')

let transporter = nodemailer.createTransport({
    service: 'gmail', // Bạn có thể sử dụng các dịch vụ khác như Yahoo, Outlook
    auth: {
        user: 'hieudmhe182298@fpt.edu.vn', // Thay bằng email của bạn
        pass: 'ygbt nywx dvax cpkf' // Thay bằng mật khẩu của bạn
    }
});

let mailOptions = {
    from: 'hieudmhe182298@fpt.edu.vn',
    to: 'hhhttct102@gmail.com',
    subject: 'Hello from Node.js!',
    html: emailTemplate
};

let send = transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Email sent: ' + info.response);
});

router.post('/send_code', (req,res) => {
    send();
    console.log('email was sent');
})

module.exports = router;