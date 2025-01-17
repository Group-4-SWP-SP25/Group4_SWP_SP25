const connect = require("../connectDB.js");
const findUserById = require("./findUserById.js");

const sql = require("mssql");

const changePassword = async (req, res) => {
  try {
    const { userId, newPassword, oldPassword } = req.body;
    const pool = await connect(); // Get the connection pool

    // Check old password
    const user = await findUserById(Number(userId));
    if (oldPassword === user.password) {
      res.status(200).json({ success: "Success" });
    } else {
      res.status(400).json({ error: "Your password is wrong" });
      return;
    }
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
    await pool.close();
  } catch (err) {
    throw err; // Optionally re-throw the error
  }
};

module.exports = changePassword;
