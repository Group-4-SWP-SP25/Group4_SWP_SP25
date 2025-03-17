const getPaymentByID = require("../../database/payment/getPaymentByID");

const paymentInfo = async (req, res) => {
  const { userID, paymentID } = req.body;

  try {
    const payment = await getPaymentByID(paymentID, userID);
    res.status(200).send(payment);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = paymentInfo;
