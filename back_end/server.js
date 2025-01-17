const express = require("express");
const cors = require('cors');
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors())

// IMPORT MODULE

const sendMail = require('./myModule/mail.js')
const changePassword = require("./myModule/database/user.js");

// ----------------------------------------------------------

// CREATE API

app.post('/sendMail',sendMail);
//app.use(changePassword)

// ----------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
