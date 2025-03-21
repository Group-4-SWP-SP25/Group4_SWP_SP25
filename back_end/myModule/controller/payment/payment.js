const {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
} = require("vnpay");

const payment = async (req, res) => {
  const vnp = new VNPay({
    tmnCode: "AV7944HH",
    secureSecret: "ED5E7M12O7Y465NEFVJ7GYIWSEGSNR08",
    vnpayHost: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    testMode: true,
    hashAlgorithm: "SHA512",
    loggerFn: ignoreLogger,
  });

  const exprire = new Date();
  exprire.setMinutes(exprire.getMinutes() + 15);
  const vnpayResponse = await vnp.buildPaymentUrl({
    vnp_Amount: req.body.money,
    vnp_IpAddr: "127.0.0.1",
    vnp_TxnRef: `${Date.now()}`,
    vnp_OrderInfo: "Test",
    vnp_OrderType: "billpayment",
    vnp_ReturnUrl: `http://localhost:3000/payment/callback?carID=${req.body.carID}&userID=${req.body.userID}`,
    vnp_Locale: VnpLocale.EN,
    vnp_CreateDate: dateFormat(new Date()),
    vnp_ExpireDate: dateFormat(exprire),
  });
  res.status(200).send(vnpayResponse);
};

module.exports = payment;
