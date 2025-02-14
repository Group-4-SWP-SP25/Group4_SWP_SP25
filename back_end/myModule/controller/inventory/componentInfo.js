const getInventoryByPartId = require("../../database/inventory/getInventoryByPartId");

const componentInfo = async (req, res) => {
  try {
    const { partId } = req.body;
    const inventory = await getInventoryByPartId(partId);
    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = componentInfo;
