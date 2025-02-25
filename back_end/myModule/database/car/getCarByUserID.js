const sql = require("mssql");

const getCarByUserID = async (userID) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM [Car] WHERE UserID = @userID
    `;

    const result = await pool
      .request()
      .input("userID", sql.Int, userID)
      .query(query);
    return result.recordset;
  } catch (err) {
    console.error("Error", err);
    return null;
  }
};

module.exports = getCarByUserID;
