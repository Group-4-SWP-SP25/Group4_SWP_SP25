const connect = require("./connectDB.js");
const sql = require("mssql");

const changePassword = async (req, res) => {
  try {

    const {userID, newPassword} = req.body;
    const pool = await connect(); // Get the connection pool

    const query = `
      UPDATE [User]
      SET Password = @newPassword
      WHERE UserID = @userId
    `;
    // Example query
    const result = await pool
      .request()
      .input("newPassword", sql.VarChar, newPassword) // Assuming password is a string
      .input("userId", sql.Int, userId) // Assuming user_id is an integer
      .query(query);

    console.log("Password updated successfully.");
    return result; // Optionally return the result
    // Close the connection (optional because `mssql` handles pooling)
  } catch (err) {
    console.error("Error updating password:", err.message);
    throw err; // Optionally re-throw the error
  }
}

module.exports = changePassword
