const sql = require("mssql");

const getPartInfoByID = async (partID) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM PartInfo
      WHERE PartID = @partID
    `;

    const result = await pool
      .request()
      .input("partID", sql.Int, partID)
      .query(query);
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = getPartInfoByID;
