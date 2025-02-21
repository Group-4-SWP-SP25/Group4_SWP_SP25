const insertOrder = require("../../database/order/insertOrder.js");

const placeOrder = async (req, res) => {
  try {
    console.log(req.body);
    await insertOrder(req.body);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = placeOrder;
