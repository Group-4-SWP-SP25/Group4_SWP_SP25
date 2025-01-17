const connect = require("../connectDB.js");
const sql = require("mssql");
const User = require("../../model/user.js");

const CheckAccountExist = async (req,res) => {
  try {
    const { userId, password } = req.body;
    const pool = await connect(); // Get the connection pool
    console.log(userId, " ", password);

    const query = `
      SELECT * FROM [User] WHERE UserID = @userId AND Password = @password
    `;
    // Example query
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("password", sql.VarChar, password)
      .query(query);

      if (result.recordset.length > 0) { console.log('Account exists.'); } else { console.log('Account does not exist.');}

      const userData = result.recordset[0];
      const user = new User(userData);
      res.send(user.userInfo());
      await pool.close();
  } catch (err) {
    res.status(404).send({ error: "Wrong account. Please check again!" });
      console.log("Error", err);
  }
  
};

module.exports = CheckAccountExist;
