const sql = require("mssql");

const getBillListByPayment = async (paymentID, userID) => {
  try {
    const pool = global.pool;
    const query = `SELECT * FROM Bill WHERE PaymentID = @paymentID AND UserID = @userID`;
    const result = await pool
      .request()
      .input("paymentID", sql.Int, paymentID)
      .input("userID", sql.Int, userID)
      .query(query);
    return result.recordset;
  } catch (err) {
    throw err;
  }
};

module.exports = getBillListByPayment;
