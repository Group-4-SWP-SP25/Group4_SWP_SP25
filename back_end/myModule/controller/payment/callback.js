const querystring = require("qs");
const crypto = require("crypto");

const paymentCallback = (req, res) => {
  const vnpParams = req.query; // Lấy dữ liệu từ query string
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
        "http://127.0.0.1:5500/front_end/Payment/payment.html"
      );
      return;
    } else if (vnpParams["vnp _ResponseCode"] === "00") {
      return res.redirect("/frontend/Payment/success.html");
    } else {
      return res.redirect("/frontend/Payment/fail.html");
    }
  } else {
    return res.status(400).send("🚨 Chữ ký không hợp lệ!");
  }
};

module.exports = paymentCallback;
