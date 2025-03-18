const getBillListByPayment = require("../../database/bill/getBillListByPayment");

const billList = async (req, res) => {
  const { userID, paymentID } = req.body;

  try {
    const billList = await getBillListByPayment(paymentID, userID);
    res.status(200).send(billList);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = billList;
