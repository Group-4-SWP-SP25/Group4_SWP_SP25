const getInventoryByPartId = require("../../database/inventory/getInventoryByPartId");

const componentInStockInfo = async (req, res) => {
  try {
    const { serviceID } = req.body;
    const inventory = await getInventoryByPartId(serviceID);
    res.status(200).send(inventory);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = componentInStockInfo;
