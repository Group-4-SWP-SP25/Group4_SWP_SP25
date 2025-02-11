const checkUserName = require("./checkUserName.js");

const sql = require("mssql");

const changePassword = async (req, res) => {
  try {
    const { account, newPassword, oldPassword } = req.body;
    console.log("acc: ", account);
    const pool = global.pool; // Get the connection pool
    // Check old password
    const user = await checkUserName(account);
    console.log(user);
    if (oldPassword == null) {
      // RESET
      if (newPassword == user.Password) {
        return res.status(300).send("same");
      }
    } else if (oldPassword != user.Password) {
      return res.status(400).json({ error: "Your password is wrong" });
    }

    const userId = user.UserID;
    console.log(userId);
    console.log(newPassword);
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
