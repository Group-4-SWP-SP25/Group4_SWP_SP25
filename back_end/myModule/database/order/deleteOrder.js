const deleteAnOrder = async (userId, orderId) => {
  try {
    const pool = global.pool;
    const query = `
      DELETE FROM [Order]
      WHERE  UserID = @userId AND OrderID = @orderId;
    `;
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("orderId", sql.Int, orderId)
      .query(query);
  } catch (err) {
    throw err;
  }
};

const deletAllOrder = async (userId) => {
  try {
    const pool = global.pool;
    const query = `
            DELETE FROM [Order]
            WHERE UserID = @userId;
        `;
    await pool.request().input("userId", sql.Int, userId).query(query);
  } catch (err) {
    throw err;
  }
};

module.exports = { deleteAnOrder, deletAllOrder };
