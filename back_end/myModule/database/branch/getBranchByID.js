const sql = require("mssql");

const getBranchByID = async (branchID) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM Branch
      WHERE BranchID = @branchID
    `;

    const result = await pool
      .request()
      .input("branchID", sql.Int, branchID)
      .query(query);
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = getBranchByID;
