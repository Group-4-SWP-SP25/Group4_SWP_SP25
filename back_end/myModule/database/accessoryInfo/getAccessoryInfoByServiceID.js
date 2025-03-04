const sql = require("mssql");

const getAccessoryInfoByServiceID = async (serviceID) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM AccessoryInfo
      WHERE ServiceID = @serviceID
    `;

    const result = await pool
      .request()
      .input("serviceID", sql.Int, serviceID)
      .query(query);
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = getAccessoryInfoByServiceID;
