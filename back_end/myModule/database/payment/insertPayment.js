const sql = require("mssql");

const insertPayment = async (payment) => {
  const pool = global.pool;

  const query = `
    INSERT INTO Payment (UserID, Amount) VALUES (@userID, @amount);
  `;

  await pool
    .request()
    .input("userID", sql.Int, payment.userID)
    .input("amount", sql.Int, payment.amount)
    .query(query);
};

module.exports = insertPayment;
