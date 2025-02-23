const getInventoryByPartId = require("../../database/inventory/getInventoryByPartId");

const componentInStockInfo = async (req, res) => {
  try {
    const { partID } = req.body;
    const inventory = await getInventoryByPartId(partID);
    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = componentInStockInfo;
