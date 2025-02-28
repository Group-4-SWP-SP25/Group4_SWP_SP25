const express = require("express");
const cors = require("cors");
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      `http://127.0.0.1:3000`,
      `http://localhost:3000`,
      `http://127.0.0.1:5500`,
      `http://localhost:5500`,
    ], // Chỉ định origin được phép truy cập
    credentials: true, // Cho phép gửi cookie hoặc session
  })
);

// ----------------------------------------------------------
// IMPORT MODULE
// admin
const connectDB = require("./myModule/database/connectDB.js");
const {
  authenticateJWT,
  authenticateADMIN,
} = require("./myModule/Utils/JWT.js");
const {
  GetUserInfo,
  GetUserInfo_Admin,
} = require("./myModule/database/user/getUserInfo.js");
const {
  getUserList,
  getTotalUserCount,
} = require("./myModule/controller/UserListControl.js");

// user
const register = require("./myModule/controller/register.js");
const getPassword = require("./myModule/controller/user/getPassword.js");
const changePassword = require("./myModule/database/user/changePassword.js");
const checkAccount = require("./myModule/controller/user/checkAccount.js");
const checkUserName = require("./myModule/database/user/checkUserName.js");
const {
  resetPassword,
  verification,
} = require("./myModule/controller/resetpassword.js");
const { AuthGoogle, Auth } = require("./myModule/controller/Login.js");
const getUserProfile = require("./myModule/database/user/getUserProfile.js");
const userInfo = require("./myModule/controller/user/userInfo.js");
const updateUserProfile = require("./myModule/controller/user/updateUserProfile.js");

// service
const serviceInfo = require("./myModule/controller/service/serviceInfo.js");
const serviceListPerPart = require("./myModule/controller/service/listServicePerPart.js");
const getServiceTypeDetailByName = require("./myModule/database/service/getServiceTypeDetailByName.js");
const getServiceTypeList = require("./myModule/database/service/getServiceTypeList.js")

// car
const carInfo = require("./myModule/controller/car/carInfo.js");
const carList = require("./myModule/controller/car/carList.js");

// car part
const listCarPartBySystem = require("./myModule/controller/carPart/listCarPartBySystem.js");
const carPartInfoInCar = require("./myModule/controller/carPart/carPartInfoInCar.js");

// car system
const carSystemInfo = require("./myModule/controller/carSystem/carSystemInfo.js");
const listCarSystem = require("./myModule/database/carSystem/listCarSystem.js");

// inventory
const componentInStockInfo = require("./myModule/controller/inventory/componentInStockInfo.js");

// order
const orderInfo = require("./myModule/controller/order/orderInfo.js");
const placeOrder = require("./myModule/controller/order/placeOrder.js");
const listOrder = require("./myModule/controller/order/listOrder.js");

// payment
const payment = require("./myModule/controller/payment/payment.js");
const {
  removeAnOrder,
  removeAllOrder,
} = require("./myModule/controller/order/removeOrder.js");

// message
const {
  SendMessage,
  GetMessage,
  GetList,
  CheckMessage,
} = require("./myModule/controller/message/message.js");

// ----------------------------------------------------------
// CREATE API
// admin
app.post("/CustomerManager/getUserList", authenticateADMIN, getUserList);
app.post(
  "/CustomerManager/getTotelUserCount",
  authenticateADMIN,
  getTotalUserCount
);
app.post("/CustomerManager/getUserInfo", authenticateADMIN, GetUserInfo_Admin);
app.post("/Message/SendMessage", authenticateJWT, SendMessage);
app.post("/Message/GetMessage", authenticateJWT, GetMessage);
app.post("/Message/GetList", authenticateJWT, GetList);
app.post("/Message/CheckMessage", authenticateJWT, CheckMessage);

// user
app.post("/getPassword", getPassword);
app.post("/changePassword", changePassword);
app.post("/checkAccount", checkAccount);
app.post("/getUserInfo", authenticateJWT, GetUserInfo);
app.post("/resetPassword", resetPassword);
app.post("/verification", verification);
app.post("/register", register);
app.post("/auth/google/login", AuthGoogle);
app.post("/auth/login", Auth);
app.post("/getUserProfile", getUserProfile);
app.post("/userInfo", userInfo);
app.post("/updateUserProfile", updateUserProfile);

// service
app.post("/serviceInfo", serviceInfo);
app.post("/serviceListPerPart", serviceListPerPart);
app.post("/getServiceTypeDetailByName", getServiceTypeDetailByName);
app.post("/getServiceTypeList", getServiceTypeList)

// car
app.post("/carInfo", carInfo);
app.post("/carList", carList);

// car system
app.post("/carSystemInfo", carSystemInfo);
app.post("/listCarSystem", listCarSystem);

// car part
app.post("/listCarPartBySystem", listCarPartBySystem);
app.post("/carPartInfoInCar", carPartInfoInCar);

// inventory
app.post("/componentInStockInfo", componentInStockInfo);

// order
app.post("/orderInfo", orderInfo);
app.post("/placeOrder", placeOrder);
app.post("/listOrder", listOrder);
app.post("/removeAnOrder", removeAnOrder);
app.post("/removeAllOrder", removeAllOrder);

// payment
app.post("/payment", payment);

// ----------------------------------------------------------
// START SERVER
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  (async () => {
    global.pool = await connectDB();
  })();
});
