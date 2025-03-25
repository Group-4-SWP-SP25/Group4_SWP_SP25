const getListOrderByUserID = require("../../database/order/getListOrderByUserID.js");

const listOrder = async (req, res) => {
  try {
    const { userID, carID } = req.body;
    const orderList = await getListOrderByUserID(userID, carID);
    res.status(200).send(orderList);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = listOrder;
