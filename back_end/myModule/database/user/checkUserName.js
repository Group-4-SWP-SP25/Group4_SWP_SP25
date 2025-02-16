const sql = require("mssql");

const checkUserName = async (account) => {
  try {
    const pool = global.pool; // Get the connection pool
    const query = `
      SELECT * FROM [User] WHERE UserName = @account OR Email = @account OR Phone = @account
    `;
    // Example query
    const result = await pool
      .request()
      .input("account", sql.VarChar, account)
      .query(query);
    return result.recordset[0];
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = checkUserName;
