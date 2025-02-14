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
