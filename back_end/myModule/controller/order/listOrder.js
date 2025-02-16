const getListOrderByUserID = require("../../database/order/getListOrderByUserID.js");

const listOrder = async (req, res) => {
  try {
    const { account } = req.body;
    const userId = account.UserID;
    const orderList = await getListOrderByUserID(userId);
    res.status(200).send(orderList);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = listOrder;
