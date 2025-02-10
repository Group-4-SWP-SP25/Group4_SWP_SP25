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
      if (newPassword === user.Password) {
        res.status(300).send('same');
        console.log('same')
        return;
      }
    } else if (oldPassword === user.password) {
      res.status(200).json({ success: "Success" });
    } else {
      res.status(400).json({ error: "Your password is wrong" });
      return;
    }

    const userId = user.UserID
    console.log('query')
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