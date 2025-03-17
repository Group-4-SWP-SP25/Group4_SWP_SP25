const getPaymentByUser = require("../../database/payment/getPaymentByUser");

const paymentList = async (req, res) => {
  const { userID } = req.body;

  try {
    const payment = await getPaymentByUser(userID);

    res.status(200).send(payment);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

module.exports = paymentList;
