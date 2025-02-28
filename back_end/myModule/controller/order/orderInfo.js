const getOrderByID = require("../../database/order/getOrderByID");

const orderInfo = async (req, res) => {
  try {
    const { userID, orderID } = req.body;
    const order = await getOrderByID(userID, orderID);
    res.status(200).send(order);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = orderInfo;
