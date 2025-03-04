const sql = require("mssql");
const getInventoryByBranchID = async (branchID) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM Inventory
      WHERE BranchID = @branchID
    `;

    const result = await pool
      .request()
      .input("branchID", sql.Int, branchID)
      .query(query);
    return result.recordset;
  } catch (err) {
    throw err;
  }
};

module.exports = getInventoryByBranchID;
