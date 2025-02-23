const sql = require("mssql");

const getCarSystemByID = async (carSystemID) => {
  try {
    const pool = global.pool;

    const query = `SELECT * FROM CarSystem WHERE CarSystemID = @carSystemID`;

    const result = await pool
      .request()
      .input("carSystemID", sql.Int, carSystemID)
      .query(query);
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = getCarSystemByID;
