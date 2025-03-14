const sql = require("mssql");
const getListOrderByUserID = async (userID, carID) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM [Order]
      WHERE UserID = @userID AND CarID = @carID
    `;

    const result = await pool
      .request()
      .input("userID", sql.Int, userID)
      .input("carID", sql.Int, carID)
      .query(query);
    return result.recordset;
  } catch (err) {
    throw err;
  }
};

module.exports = getListOrderByUserID;
