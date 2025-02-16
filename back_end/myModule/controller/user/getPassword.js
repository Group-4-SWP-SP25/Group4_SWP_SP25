const sql = require("mssql");
const getPassword = async (req, res) => {
  try {
    const { userID } = req.body;
    const pool = global.pool;
    const result = await pool
      .request()
      .input("userID", sql.Int, userID)
      .query(`SELECT Password FROM [User] WHERE UserID = @userID`);
    res.status(200).send(result.recordset[0]);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = getPassword;
