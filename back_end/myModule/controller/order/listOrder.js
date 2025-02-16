const getListOrderByUserID = require("../../database/order/getListOrderByUserID.js");

const listOrder = async (req, res) => {
  try {
    const { userID } = req.body;
    const orderList = await getListOrderByUserID(userID);
    res.status(200).send(orderList);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = listOrder;
