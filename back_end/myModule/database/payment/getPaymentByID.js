const sql = require("mssql");

const getPaymentByID = async (paymentID, userID) => {
  try {
    const pool = global.pool;
    const query = `SELECT * FROM Payment WHERE PaymentID = @paymentID AND UserID = @userID`;
    const result = await pool
      .request()
      .input("paymentID", sql.Int, paymentID)
      .input("userID", sql.Int, userID)
      .query(query);
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = getPaymentByID;
