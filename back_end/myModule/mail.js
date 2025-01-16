const nodemailer = require('nodemailer')
const fs = require('fs')
const express = require('express');
const router = express.Router()

let template = fs.readFileSync('./myModule/mail_Template.html','utf-8')

let code = 'i love you'
let username = 'Linh đáng iu của anh <33'

const replacements = { username: username, code: code};

for (const key in replacements) { 
    if (replacements.hasOwnProperty(key)) { 
        const value = replacements[key]; 
        const pattern = new RegExp(`{{${key}}}`, 'g'); 
        template = template.replace(pattern, value);
    }
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hieudmhe182298@fpt.edu.vn', 
        pass: 'ygbt nywx dvax cpkf' 
    }
});

let mailOptions = {
    from: 'hieudmhe182298@fpt.edu.vn',
    to: 'nlinh4339@gmail.com',
    subject: 'Hello from Node.js!',
    html: template
};

let send = transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Email sent: ' + info.response);
});

router.post('/send_code', (req,res) => {
    send();
})

module.exports = router;