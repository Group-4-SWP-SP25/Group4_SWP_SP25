const express = require('express');
const cors = require('cors');
const PORT = 3000;
const app = express();
const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage(),
});
app.use(express.json());
app.use(
    cors({
        origin: [
            `http://127.0.0.1:3000`,
            `http://localhost:3000`,
            `http://127.0.0.1:5500`,
            `http://localhost:5500`,
            `http://127.0.0.1:5501`,
            `http://localhost:5501`,
            /http:\/\/127\.0\.0\.1:300\d/, // please do not change
            /http:\/\/localhost:300\d/ // please do not change
        ], // Chỉ định origin được phép truy cập
        credentials: true // Cho phép gửi cookie hoặc session
    })
);

// ----------------------------------------------------------
// IMPORT MODULE
// admin
const connectDB = require('./myModule/database/connectDB.js');
const { authenticateJWT, authenticateADMIN } = require('./myModule/Utils/JWT.js');
const { GetUserInfo, GetUserInfo_Admin } = require('./myModule/database/user/getUserInfo.js');
const { getUserList, getTotalUserCount } = require('./myModule/controller/UserListControl.js');
const TotalRevenueToday = require('./myModule/database/SaleReport/TotalRevenueToday.js');
const TotalOrderToday = require('./myModule/database/SaleReport/TotalOrderToday.js');
const TotalProductSold = require('./myModule/database/SaleReport/TotalProductSold.js');
const TotalNewCustomer = require('./myModule/database/SaleReport/TotalNewCustomer.js');
const TopProduct = require('./myModule/database/SaleReport/TopProduct.js');

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
const { uploadFile, getFileInfo } = require("./myModule/controller/cloud/storage.js");
const { getEmployees } = require("./myModule/controller/employee/employee.js");

// branch
const branchInfo = require('./myModule/controller/branch/branchInfo.js');
const branchList = require('./myModule/controller/branch/branchList.js');

// service
const serviceInfo = require('./myModule/controller/service/serviceInfo.js');
const getServiceListAll = require('./myModule/database/service/getServiceListAll.js');
const serviceListPerPart = require('./myModule/controller/service/listServicePerPart.js');
const getServiceTypeListAll = require('./myModule/database/service/getServiceTypeListAll.js');
const getServiceTypeListByServiceTypeName = require('./myModule/database/service/getServiceTypeListByServiceTypeName.js');
const deleteServiceById = require('./myModule/database/service/deleteServiceByID.js');
const updateServiceById = require('./myModule/database/service/updateServiceByID.js');
const addService = require('./myModule/database/service/addService.js');

// car
const carInfo = require('./myModule/controller/car/carInfo.js');
const carList = require('./myModule/controller/car/carList.js');

// car part
const carPartInfoInCar = require('./myModule/controller/carPart/carPartInfoInCar.js');

// part info
const listPartBySystem = require('./myModule/controller/partInfo/listPartBySystem.js');
const partInfo = require('./myModule/controller/partInfo/partInfo.js');

// car system
const carSystemInfo = require('./myModule/controller/carSystem/carSystemInfo.js');
const listCarSystem = require('./myModule/database/carSystem/listCarSystem.js');

// accessory
const accessoryInfo = require('./myModule/controller/accessory/accessoryInfo.js');

// inventory
const accessoryListInStock = require('./myModule/controller/inventory/accessoryListInStock.js');
const componentInStockInfo = require('./myModule/controller/inventory/componentInStockInfo.js');

// order
const orderInfo = require('./myModule/controller/order/orderInfo.js');
const placeOrder = require('./myModule/controller/order/placeOrder.js');
const listOrder = require('./myModule/controller/order/listOrder.js');
const { removeAnOrder, removeAllOrder } = require('./myModule/controller/order/removeOrder.js');

// payment
const payment = require('./myModule/controller/payment/payment.js');
const paymentCallback = require('./myModule/controller/payment/callback.js');

// message
const { SendMessage, GetMessage, GetList, CheckMessage } = require('./myModule/controller/message/message.js');

// calendar
const { getEvents_api } = require('./myModule/controller/calendar/calendar.js')

// ----------------------------------------------------------
// CREATE API
// admin
app.post("/CustomerManager/getUserList", authenticateADMIN, getUserList);
app.post("/CustomerManager/getTotelUserCount", authenticateADMIN, getTotalUserCount);
app.post("/CustomerManager/getUserInfo", authenticateADMIN, GetUserInfo_Admin);
app.post("/Message/SendMessage", authenticateJWT, SendMessage);
app.post("/Message/GetMessage", authenticateJWT, GetMessage);
app.post("/Message/GetList", authenticateJWT, GetList);
app.post("/Message/CheckMessage", authenticateJWT, CheckMessage);
app.post("/Calendar/GetEvents", authenticateADMIN, getEvents_api);
app.post("/Employee/getEmployees", authenticateADMIN, getEmployees);
app.post('/TotalRevenueToday', authenticateADMIN, TotalRevenueToday);
app.post('/TotalOrderToday', authenticateADMIN, TotalOrderToday);
app.post('/TotalProductSold', authenticateADMIN, TotalProductSold);
app.post('/TotalNewCustomer', authenticateADMIN, TotalNewCustomer);
app.post('/TopProduct', authenticateADMIN, TopProduct);

// user
app.post('/getPassword', getPassword);
app.post('/changePassword', changePassword);
app.post('/checkAccount', checkAccount);
app.post('/getUserInfo', authenticateJWT, GetUserInfo);
app.post('/resetPassword', resetPassword);
app.post('/verification', verification);
app.post('/register', register);
app.post('/auth/google/login', AuthGoogle);
app.post('/auth/login', Auth);
app.post('/getUserProfile', getUserProfile);
app.post('/userInfo', userInfo);
app.post('/updateUserProfile', updateUserProfile);

app.post("/uploadFile", upload.single('file'), uploadFile);
app.post("/getFileInfo", authenticateJWT, getFileInfo);

// branch
app.post('/branchInfo', branchInfo);
app.post('/branchList', branchList);

// service
app.post('/serviceInfo', serviceInfo);
app.post('/getServiceListAll', getServiceListAll);
app.post('/serviceListPerPart', serviceListPerPart);
app.post('/getServiceTypeListAll', getServiceTypeListAll);
app.post('/getServiceTypeListByServiceTypeName', getServiceTypeListByServiceTypeName);
app.post('/deleteServiceById', deleteServiceById);
app.post('/updateServiceById', updateServiceById);
app.post('/addService', addService);

// car
app.post('/carInfo', carInfo);
app.post('/carList', carList);

// car system
app.post('/carSystemInfo', carSystemInfo);
app.post('/listCarSystem', listCarSystem);

// car part
app.post('/carPartInfoInCar', carPartInfoInCar);

// part info
app.post('/listPartBySystem', listPartBySystem);
app.post('/partInfo', partInfo);

// accessory
app.post('/accessoryInfo', accessoryInfo);

// inventory
app.post('/accessoryListInStock', accessoryListInStock);
app.post('/componentInStockInfo', componentInStockInfo);

// order
app.post('/orderInfo', orderInfo);
app.post('/placeOrder', placeOrder);
app.post('/listOrder', listOrder);
app.post('/removeAnOrder', removeAnOrder);
app.post('/removeAllOrder', removeAllOrder);

// payment
app.post('/payment', payment);
app.get('/payment/callback', paymentCallback);


// ----------------------------------------------------------
// START SERVER
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    (async () => {
        global.pool = await connectDB();
    })();
});
