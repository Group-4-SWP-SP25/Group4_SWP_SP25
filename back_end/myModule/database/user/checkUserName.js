const sql = require("mssql");

const checkUserName = async (account) => {
  try {
    const pool = global.pool; // Get the connection pool

    const query = `
      SELECT * FROM [User] WHERE UserName = @account OR Email = @account
    `;
    // Example query
    const result = await pool
      .request()
      .input("account", sql.VarChar, account)
      .query(query);

    if (result.recordset.length > 0) {
      const userData = result.recordset[0];
      return userData;
    } else {
      return null;
    }

  } catch (err) {
    res.status(404).send({ error: "Wrong account. Please check again!" });
    console.log("Error", err);
  }
};

module.exports = checkUserName;