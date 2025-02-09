const connect = require("../connectDB.js");
const sql = require("mssql");
const User = require("../../model/user.js");

const GetUserInfo = async (req, res) => {
  try {
    const { id } = req.body;
    const pool = global.pool; // Get the connection pool

    const query = `
      SELECT * FROM [User] WHERE UserID = @id
    `;
    // Example query
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(query);

    if (result.recordset.length > 0) { console.log('Account exists.'); } else { console.log('Account does not exist.'); }

    const userData = result.recordset[0];
    const user = new User(userData);
    res.json(user.userInfo());
  } catch (err) {
    res.status(404).send({ error: "Wrong account. Please check again!" });
    console.log("Error", err);
  }

};

module.exports = GetUserInfo;
