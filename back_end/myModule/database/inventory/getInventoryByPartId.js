const sql = require("mssql");
const getInventoryByPartId = async (partID) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM Inventory
      WHERE PartID = @partId
    `;

    const result = await pool
      .request()
      .input("partId", sql.Int, partID)
      .query(query);
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = getInventoryByPartId;
