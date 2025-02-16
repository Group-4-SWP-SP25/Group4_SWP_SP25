const findUserById = async (id) => {
  try {
    const pool = global.pool;
    const query = `SELECT * FROM [User] WHERE UserID = @id`;
    const result = await pool.request().input("id", sql.Int, id).query(query);
    const userData = result.recordset[0];

    return userData;
  } catch (err) {
    throw err;
  }
};

module.exports = findUserById;
