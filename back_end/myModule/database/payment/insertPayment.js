const sql = require("mssql");

const insertPayment = async (payment) => {
  const pool = global.pool;

  const query = `
    INSERT INTO Payment (UserID, CarID, Amount) VALUES (@userID, @carID, @amount);
  `;

  await pool
    .request()
    .input("userID", sql.Int, payment.userID)
    .input("carID", sql.Int, payment.carID)
    .input("amount", sql.Int, payment.amount)
    .query(query);
};

module.exports = insertPayment;
