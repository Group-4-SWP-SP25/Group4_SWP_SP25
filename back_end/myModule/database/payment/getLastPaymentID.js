const sql = require("mssql");

const getLastPaymentID = async (userID) => {
  try {
    const pool = global.pool;
    let paymentID = 0;

    const query = `SELECT MAX(PaymentID) AS PaymentID FROM Payment WHERE UserID = @userID`;

    const result = await pool
      .request()
      .input("userID", sql.Int, userID)
      .query(query);

    if (result.recordset[0]) {
      paymentID = result.recordset[0].PaymentID;
    }

    return paymentID;
  } catch (err) {
    throw err;
  }
};

module.exports = getLastPaymentID;
