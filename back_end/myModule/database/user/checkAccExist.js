const sql = require("mssql");

const CheckAccountExist = async (req, res) => {
  try {
    const { account, password } = req.body;
    const pool = global.pool; // Get the connection pool
    console.log(account, " ", password)

    const query = `
      SELECT * FROM [User] WHERE (UserName = @account OR Email = @account) AND Password = @password
    `;
    // Example query
    const result = await pool
      .request()
      .input("account", sql.VarChar, account)
      .input("password", sql.VarChar, password)
      .query(query);

    if (result.recordset.length > 0) {
      console.log("Account exists.");
      const userData = result.recordset[0];
      const id = userData.UserID;
      const role = userData.Role;
      res.json({ id: id, role: role });
    } else {
      console.log("Account does not exist.");
      res.json({ id: -1 });
    }
  } catch (err) {
    res.status(404).send({ error: "Wrong account. Please check again!" });
    console.log("Error", err);
  }
};

module.exports = CheckAccountExist;
