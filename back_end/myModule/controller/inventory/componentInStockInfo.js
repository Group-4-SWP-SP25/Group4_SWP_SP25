const getInventoryByBranchIDAndAccessoryID = require("../../database/inventory/getInventoryByBranchIDAndAccessoryID");

const componentInStockInfo = async (req, res) => {
  try {
    const { branchID, accessoryID } = req.body;
    const inventory = await getInventoryByBranchIDAndAccessoryID(
      branchID,
      accessoryID
    );
    res.status(200).send(inventory);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = componentInStockInfo;
