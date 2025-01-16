const express = require('express')
const PORT = 3000
const app = express()

// IMPORT MODULE 

const sentMail = require('./myModule/mail.js')

// ----------------------------------------------------------

// CREATE API

app.use('/', sentMail);

// ----------------------------------------------------------

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    fetch('http://localhost:3000/send_code')
})