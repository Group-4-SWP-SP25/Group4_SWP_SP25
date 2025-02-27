const {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
} = require("vnpay");

const payment = async (req, res) => {
  const vnp = new VNPay({
    tmnCode: process.env.VNP_TMN_CODE,
    secureSecret: process.env.VNP_SECURE_SECRET,
    vnpayHost: process.env.VNPAY_HOST,
    testMode: true,
    hashAlgorithm: "SHA512",
    loggerFn: ignoreLogger,
  });
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const vnpayResponse = await vnp.buildPaymentUrl({
    vnp_Amount: 100000,
    vnp_IpAddr: req.ip,
    vnp_TxnRef: "123456",
    vnp_OrderInfo: "Test",
    vnp_OrderType: "billpayment",
    vnp_ReturnUrl: "http://localhost:3000/payment/callback",
    vnp_Locale: VnpLocale.VN,
    vnp_CreateDate: dateFormat(new Date(), "ddMMyyyyHHmmss"),
    vnp_ExpireDate: dateFormat(tomorrow, "ddMMyyyyHHmmss"),
  });
  res.status(200).send(vnpayResponse);
};

module.exports = payment;
