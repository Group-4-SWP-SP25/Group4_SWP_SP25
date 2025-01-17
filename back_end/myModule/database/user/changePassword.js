const connect = require("../connectDB.js");
const sql = require("mssql");

const changePassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const pool = await connect(); // Get the connection pool

    const query = `
      UPDATE [User]
      SET Password = @newPassword
      WHERE UserID = @userId
    `;
    // Example query
    await pool
      .request()
      .input("newPassword", sql.VarChar, newPassword) // Password as string
      .input("userId", sql.Int, userId) // UserID as integer
      .query(query);
  } catch (err) {
    throw err; // Optionally re-throw the error
  }
};

module.exports = changePassword;
