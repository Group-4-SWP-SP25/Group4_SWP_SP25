const calQuantityInOrder = require("../../database/inventory/calQuantityInOrder");

const totalQuantityInOrder = async (req, res) => {
  try {
    const { branchID, accessoryID } = req.body;
    const totalQuantity = await calQuantityInOrder(branchID, accessoryID);
    res.status(200).json({ totalQuantity });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = totalQuantityInOrder;
