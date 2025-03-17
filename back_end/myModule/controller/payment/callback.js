const querystring = require("qs");
const crypto = require("crypto");
const insertPayment = require("../../database/payment/insertPayment");
const getLastPaymentID = require("../../database/payment/getLastPaymentID");
const insertBill = require("../../database/bill/insertBill");

const paymentCallback = async (req, res) => {
  const vnpParams = req.query;
  const carID = vnpParams.carID;
  delete vnpParams.carID;
  const userID = vnpParams.userID;
  delete vnpParams.userID;
  const secureSecret = "ED5E7M12O7Y465NEFVJ7GYIWSEGSNR08";

  const secureHash = vnpParams["vnp_SecureHash"];
  delete vnpParams["vnp_SecureHash"];
  delete vnpParams["vnp_SecureHashType"];

  const sortedParams = querystring.stringify(vnpParams, { encode: false });
  const hmac = crypto.createHmac("sha512", secureSecret);
  const signed = hmac.update(Buffer.from(sortedParams, "utf-8")).digest("hex");

  if (secureHash !== signed) {
    return res.status(400).send("🚨 Chữ ký không hợp lệ!");
  }

  if (vnpParams["vnp_ResponseCode"] == "24") {
    return res.redirect(
      `http://127.0.0.1:5500/front_end/Payment/payment.html?carID=${carID}`
    );
  }

  if (vnpParams["vnp_ResponseCode"] == "00") {
    try {
      await paymentSuccess(userID, carID, vnpParams, res);
    } catch (error) {
      console.error("Payment processing failed:", error);
      return res.redirect(
        `http://127.0.0.1:5500/front_end/Payment/fail.html?err=Internal Server Error&carID=${carID}`
      );
    }
  } else {
    const errMsg =
      vnpParams["vnp_ResponseCode"] == "11"
        ? "The payment waiting period has expired. Please try again."
        : "An error occurred during the transaction. Please try again.";

    return res.redirect(
      `http://127.0.0.1:5500/front_end/Payment/fail.html?err=${errMsg}&carID=${carID}`
    );
  }
};

const paymentSuccess = async (userID, carID, vnpParams, res) => {
  const orderList = await fetch("http://localhost:3000/listOrderByCar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID, carID }),
  });

  const orders = await orderList.json();
  await insertPayment({ userID, carID, amount: vnpParams["vnp_Amount"] / 100 });
  const paymentID = await getLastPaymentID(userID);

  for (const order of orders) {
    const bill = {
      userID,
      paymentID,
      partID: order.PartID,
      serviceID: order.ServiceID,
      branchID: order.BranchID,
      quantityUsed: order.QuantityUsed,
      totalPrice: order.EstimatedCost,
      orderDate: order.OrderDate,
    };
    await insertBill(bill);
  }

  await fetch("http://localhost:3000/removeAllOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID: parseInt(userID), carID: parseInt(carID) }),
  });

  return res.redirect(
    `http://127.0.0.1:5500/front_end/Payment/success.html?paymentID=${paymentID}`
  );
};

module.exports = paymentCallback;
