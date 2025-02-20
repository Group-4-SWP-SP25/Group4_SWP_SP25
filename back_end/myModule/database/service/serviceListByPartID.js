const sql = require("mssql");

const serviceListByPartID = async (partID) => {
  const pool = global.pool;

  const query = `SELECT * FROM Service WHERE PartID = @partID`;

  const result = await pool
    .request()
    .input("partID", sql.Int, partID)
    .query(query);

  return result.recordset;
};

module.exports = serviceListByPartID;
