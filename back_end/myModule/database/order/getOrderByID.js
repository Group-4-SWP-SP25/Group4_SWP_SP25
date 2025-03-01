const sql = require("mssql");

const getOrderByID = async (userID, orderID) => {
  try {
    const pool = global.pool;

    const query = `SELECT * FROM [Order] WHERE UserID = @userID AND OrderID = @orderID`;

    const result = await pool
      .request()
      .input("userID", sql.Int, userID)
      .input("orderID", sql.Int, orderID)
      .query(query);
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = getOrderByID;
