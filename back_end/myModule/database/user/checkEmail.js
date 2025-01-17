const connect = require("../connectDB.js");
const sql = require("mssql");

const checkEmail = async (req, res) => {
  try {
    const { account} = req.body;
    const pool = await connect(); // Get the connection pool

    const query = `
      SELECT * FROM [User] WHERE UserName = @account OR Email = @account
    `;
    // Example query
    const result = await pool
      .request()
      .input("account", sql.VarChar, account)
      .query(query);

    if (result.recordset.length > 0) {
      console.log("Account exists.");
      const userData = result.recordset[0];
      const id = userData.UserID;
      res.json({ id: id });
    } else {
      console.log("Account does not exist.");
      res.json({ id: -1 });
    }
    
    await pool.close();
  } catch (err) {
    res.status(404).send({ error: "Wrong account. Please check again!" });
    console.log("Error", err);
  }
};

module.exports = checkEmail;