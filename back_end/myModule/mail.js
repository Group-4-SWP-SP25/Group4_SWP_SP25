const nodemailer = require('nodemailer')
const fs = require('fs');
const { use } = require('./database/user');

let send = (req, res) => {
    // read template
    let template = fs.readFileSync('./myModule/mail_Template.html','utf-8')
    // info
    const {username, code} = req.body;
    console.log('Email:', username)
    const replacements = { username: username, code: code};
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
        to: username,
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