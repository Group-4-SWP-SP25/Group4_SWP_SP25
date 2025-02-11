const findUserById = require("./findUserById.js");
const checkUserName = require('./checkUserName.js')

const sql = require("mssql");

const changePassword = async (req, res) => {
  try {
    const { account, newPassword, oldPassword } = req.body;
    const pool = global.pool; // Get the connection pool
    // Check old password
    const user = await checkUserName(account);
    if (oldPassword === null) {
      if (newPassword === user.password) {
        return res.status(300).send("same");
      }
    } else if (oldPassword === user.password) {
      return res.status(200).json({ success: "Success" });
    } else {
      return res.status(400).json({ error: "Your password is wrong" });
    }

    const userId = user.UserID
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
    res.status(200).json({ success: "Success" });
  } catch (err) {
    throw err; // Optionally re-throw the error
  }
};

module.exports = changePassword;
