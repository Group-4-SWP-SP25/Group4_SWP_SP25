const sql = require("mssql");

const getPaymentByUser = async (userID) => {
  try {
    const pool = global.pool;

    const query = `SELECT * FROM Payment WHERE UserID = @userID`;

    const result = await pool
      .request()
      .input("userID", sql.Int, userID)

      .query(query);

    return result.recordset;
  } catch (error) {
    console.error(error);
  }
};

module.exports = getPaymentByUser;
