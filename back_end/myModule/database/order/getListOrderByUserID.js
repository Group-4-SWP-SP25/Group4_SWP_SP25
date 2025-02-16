const getListOrderByUserID = async (userId) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM [Order]
      WHERE UserID = @userId
    `;

    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query(query);
    return result.recordset;
  } catch (err) {
    throw err;
  }
};
