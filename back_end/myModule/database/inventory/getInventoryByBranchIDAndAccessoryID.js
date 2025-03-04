const sql = require("mssql");

const getInventoryByBranchIDAndAccessoryID = async (branchID, accessoryID) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM Inventory
      WHERE BranchID = @branchID AND AccessoryID = @accessoryID
    `;

    const result = await pool
      .request()
      .input("branchID", sql.Int, branchID)
      .input("accessoryID", sql.Int, accessoryID)
      .query(query);
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = getInventoryByBranchIDAndAccessoryID;
