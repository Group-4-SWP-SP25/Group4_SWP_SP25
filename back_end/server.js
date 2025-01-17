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

// ----------------------------------------------------------

// CREATE API

app.post("/sendMail", sendMail);
app.post("/chagnePassword", changePassword);
app.post("/checkAccountExist", CheckAccountExist);

// ----------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  data = {
    userId: 1,
    password: "new_secure_password",
  };
  try {
    fetch("http://localhost:3000/checkAccountExist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => console.log("result: ", result.password));
  } catch (e) {
    console.log(e);
  }
});
