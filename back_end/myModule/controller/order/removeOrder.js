const {
  deleteAnOrder,
  deletAllOrder,
} = require("../../database/order/deleteOrder");

const removeAnOrder = async (req, res) => {
  try {
    const { userID, orderID } = req.body;
    await deleteAnOrder(userID, orderID);

    res.status(200).send({ message: "Order deleted" });
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const removeAllOrder = async (req, res) => {
  try {
    const { userID } = req.body;
    await deletAllOrder(userID);
    res.status(200).send({ message: "All orders deleted" });
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = { removeAnOrder, removeAllOrder };
