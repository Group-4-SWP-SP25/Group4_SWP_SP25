const sql = require("mssql");
const getServiceById = async (serviceID) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM Service
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

module.exports = getServiceById;
