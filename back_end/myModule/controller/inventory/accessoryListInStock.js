const getInventoryByBranchID = require("../../database/inventory/getInventoryByBranchID");

const accessoryListInStock = async (req, res) => {
  try {
    const { branchID } = req.body;
    const inventory = await getInventoryByBranchID(branchID);
    res.status(200).send(inventory);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = accessoryListInStock;
