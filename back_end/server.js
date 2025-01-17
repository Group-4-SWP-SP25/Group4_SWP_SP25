const express = require("express");
const cors = require("cors");
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors());

// IMPORT MODULE

const sendMail = require("./myModule/Utils/mail.js");
const changePassword = require("./myModule/database/user/changePassword.js");
const CheckAccountExist = require("./myModule/database/user/checkAccExist.js");
const GetUserInfo = require("./myModule/database/user/getUserInfo.js");

// ----------------------------------------------------------

// CREATE API

app.post("/sendMail", sendMail);
app.post("/changePassword", changePassword);
app.post("/checkAccountExist", CheckAccountExist);
app.post("/getUserInfo", GetUserInfo);

// ----------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // data = {
  //   account: 'q8edh12hi',
  //   password: 'doanhieu'
  // };
  // try{
  //   fetch('http://localhost:3000/checkAccountExist', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json'},
  //     body: JSON.stringify(data)
  //   })
  //   .then(response => {return response.json()})
  //   .then(result => console.log('result: ', result))
  // }catch (e){
  //   console.log(e)
  // }
});
