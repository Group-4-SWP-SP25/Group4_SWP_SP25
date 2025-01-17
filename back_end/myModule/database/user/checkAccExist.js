const connect = require("../connectDB.js");
const sql = require("mssql");
const User = require("../../model/user.js");

const CheckAccountExist = async (userId, password) => {
  try {
    // const { userId, password } = req.body;
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
    try {
      const userData = result.recordset[0];
      console.log("Error1");
      const user = new User(userData);
      console.log("Error2");
      res.send(user.userInfo());
      console.log("Error");
      console.log(result);
    } catch (err) {
      res.status(404).send({ error: "Wrong account. Please check again!" });
      console.log("Error");
    }
  } catch (err) {}
};

module.exports = CheckAccountExist;
