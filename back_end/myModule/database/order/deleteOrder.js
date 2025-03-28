const sql = require("mssql");
const deleteAnOrder = async (userID, orderID) => {
  try {
    const pool = global.pool;
    const query = `
      DELETE FROM [Order]
      WHERE  UserID = @userID AND OrderID = @orderID;
    `;
    await pool
      .request()
      .input("userID", sql.Int, userID)
      .input("orderID", sql.Int, orderID)
      .query(query);
  } catch (err) {
    throw err;
  }
};

const deletAllOrder = async (userID, carID) => {
  try {
    const pool = global.pool;
    const query = `
      ALTER TABLE [Order] ENABLE TRIGGER DeleteOrder;
      DELETE FROM [Order] WHERE UserID = @userID AND CarID = @carID;
      ALTER TABLE [Order] DISABLE TRIGGER DeleteOrder;
    `;
    await pool
      .request()
      .input("userID", sql.Int, userID)
      .input("carID", sql.Int, carID)
      .query(query);
  } catch (err) {
    throw err;
  }
};

module.exports = { deleteAnOrder, deletAllOrder };
