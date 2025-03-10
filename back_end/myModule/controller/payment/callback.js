const querystring = require("qs");
const crypto = require("crypto");
const insertPayment = require("../../database/payment/insertPayment");
const getLastPaymentID = require("../../database/payment/getLastPaymentID");
const insertBill = require("../../database/bill/insertBill");
const { removeAllOrder } = require("../order/removeOrder");

const paymentCallback = (req, res) => {
  const vnpParams = req.query; // Lấy dữ liệu từ query string
  const carID = vnpParams.carID;
  delete vnpParams.carID;
  const userID = vnpParams.userID;
  delete vnpParams.userID;
  const amount = vnpParams.vnp_Amount / 100;
  const secureSecret = "ED5E7M12O7Y465NEFVJ7GYIWSEGSNR08"; // Thay bằng secureSecret của bạn

  // Lấy chuỗi dữ liệu để kiểm tra chữ ký (không gồm vnp_SecureHash)
  const secureHash = vnpParams["vnp_SecureHash"];
  delete vnpParams["vnp_SecureHash"];
  delete vnpParams["vnp_SecureHashType"];

  const sortedParams = querystring.stringify(vnpParams, { encode: false });
  const hmac = crypto.createHmac("sha512", secureSecret);
  const signed = hmac.update(Buffer.from(sortedParams, "utf-8")).digest("hex");
  if (secureHash === signed) {
    if (vnpParams["vnp_ResponseCode"] == "24") {
      return res.redirect(
        `http://127.0.0.1:5500/front_end/Payment/payment.html?carID=${carID}`
      );
      return;
    } else if (vnpParams["vnp_ResponseCode"] == "00") {
      async function paymentSuccess() {
        const orderList = await fetch("http://localhost:3000/listOrderByCar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: userID, carID: carID }),
        });
        const orders = await orderList.json();
        await insertPayment({
          userID: userID,
          amount: vnpParams["vnp_Amount"],
        });
        const paymentID = await getLastPaymentID(userID);
        orders.forEach(async (order) => {
          const bill = {
            userID: userID,
            paymentID: paymentID,
            carID: order.CarID,
            partID: order.PartID,
            serviceID: order.ServiceID,
            branchID: order.BranchID,
            quantityUsed: order.QuantityUsed,
          };

          await insertBill(bill);
          await fetch("http://localhost:3000/removeAllOrder", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userID: parseInt(userID),
              carID: parseInt(carID),
            }),
          });
        });
      }
      paymentSuccess();
      return res.redirect(
        `http://127.0.0.1:5500/front_end/Payment/success.html?amount=${amount}`
      );
    } else {
      return res.redirect("/frontend/Payment/fail.html");
    }
  } else {
    return res.status(400).send("🚨 Chữ ký không hợp lệ!");
  }
};

module.exports = paymentCallback;
