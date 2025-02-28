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
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const vnpayResponse = await vnp.buildPaymentUrl({
    vnp_Amount: 100000,
    vnp_IpAddr: "127.0.0.1",
    vnp_TxnRef: "123456",
    vnp_OrderInfo: "Test",
    vnp_OrderType: "billpayment",
    vnp_ReturnUrl: "http://localhost:3000/payment/callback",
    vnp_Locale: VnpLocale.EN,
    vnp_CreateDate: dateFormat(new Date()),
    vnp_ExpireDate: dateFormat(tomorrow),
  });
  res.status(200).send(vnpayResponse);
};

module.exports = payment;
