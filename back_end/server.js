const express = require("express");
const cors = require("cors");
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
      "http://127.0.0.1:5501",
      "http://localhost:5501",
      "http://127.0.0.1:3001",
      "http://localhost:3001"
    ], // Chỉ định origin được phép truy cập
    credentials: true, // Cho phép gửi cookie hoặc session
  })
);

const connectDB = require("./myModule/database/connectDB.js");
const {
  authenticateJWT,
  authenticateADMIN,
} = require("./myModule/Utils/JWT.js");

// IMPORT MODULE
const getPassword = require("./myModule/controller/user/getPassword.js");
const changePassword = require("./myModule/database/user/changePassword.js");
const checkAccount = require("./myModule/controller/user/checkAccount.js");
const checkUserName = require("./myModule/database/user/checkUserName.js");
const {
  GetUserInfo,
  GetUserInfo_Admin,
} = require("./myModule/database/user/getUserInfo.js");
const {
  getUserList,
  getTotalUserCount,
} = require("./myModule/controller/UserListControl.js");
const getUserInfo = require("./myModule/database/user/getUserInfo.js");
const {
  resetPassword,
  verification,
} = require("./myModule/controller/resetpassword.js");
const register = require("./myModule/controller/register.js");
const { AuthGoogle, Auth } = require("./myModule/controller/Login.js");
// const getServiceDetail = require("./myModule/database/user/getServiceDetail.js");
const getServiceTypeDetail = require("./myModule/database/user/getServiceTypeDetail.js");

// service
const serviceInfo = require("./myModule/controller/service/serviceInfo.js");

// car
const carInfo = require("./myModule/controller/car/carInfo.js");

// car part
const listCarPartBySystem = require("./myModule/controller/carPart/listCarPartBySystem.js");
const carPartInfoInCar = require("./myModule/controller/carPart/carPartInfoInCar.js");

// car system
const listCarSystem = require("./myModule/database/carSystem/listCarSystem.js");

// inventory
const componentInfo = require("./myModule/controller/inventory/componentInfo.js");

// order
const listOrder = require("./myModule/controller/order/listOrder.js");
const {
  removeAnOrder,
  removeAllOrder,
} = require("./myModule/controller/order/removeOrder.js");

// message
const { SendMessage, GetMessage, GetList, CheckMessage } = require("./myModule/controller/message/message.js");

// ----------------------------------------------------------

// CREATE API

// user
app.post("/getPassword", getPassword);
app.post("/changePassword", changePassword);
app.post("/checkAccount", checkAccount);
app.post("/checkUserName", checkUserName);
app.post("/getUserInfo", authenticateJWT, GetUserInfo);
app.post("/resetPassword", resetPassword);
app.post("/verification", verification);
app.post("/register", register);
app.post("/auth/google/login", AuthGoogle);
app.post("/auth/login", Auth);
app.post("/getServiceTypeDetail", getServiceTypeDetail);

// admin
app.post("/CustomerManager/getUserList", authenticateADMIN, getUserList);
app.post("/CustomerManager/getTotelUserCount", authenticateADMIN, getTotalUserCount
);
app.post("/CustomerManager/getUserInfo", authenticateADMIN, GetUserInfo_Admin);
app.post("/Message/SendMessage", authenticateJWT, SendMessage);
app.post("/Message/GetMessage", authenticateJWT, GetMessage);
app.post("/Message/GetList", authenticateJWT, GetList);
app.post("/Message/CheckMessage", authenticateJWT, CheckMessage);

// app.post("/getServiceDetail", getServiceDetail);
app.post("/getServiceTypeDetail", getServiceTypeDetail);

// service
app.post("/serviceInfo", serviceInfo);

// car
app.post("/carInfo", carInfo);

// car system
app.post("/listCarSystem", listCarSystem);

// car part
app.post("/listCarPartBySystem", listCarPartBySystem);
app.post("/carPartInfoInCar", carPartInfoInCar);

// inventory
app.post("/componentInfo", componentInfo);

// order
app.post("/listOrder", listOrder);
app.post("/removeAnOrder", removeAnOrder);
app.post("/removeAllOrder", removeAllOrder);

// ----------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  (async () => {
    global.pool = await connectDB();
  })();
});
