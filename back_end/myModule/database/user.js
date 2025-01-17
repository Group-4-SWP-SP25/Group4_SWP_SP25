const connect = require("./connectDB.js");
const sql = require("mssql");
const express = require('express')
const router = express.Router()

async function changePassword(userId, newPassword) {
  try {
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

router.post('/change_password',(req,res) => changePassword(1, 'hoanghh'))

module.exports = router;
