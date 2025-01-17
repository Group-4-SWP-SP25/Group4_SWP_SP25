const connect = require("../connectDB");
const sql = require("mssql");
const User = require("../../model/user.js");

const findUserById = async (req, res) => {
  try {
    const { id } = req.body;
    const pool = await connect();

    const query = `SELECT * FROM [User] WHERE UserID = @id`;

    const result = await pool.request().input("id", sql.Int, id).query(query);
    const userData = result.recordset[0];
    const user = new User(userData);
    res.send(user.userInfo());
    await pool.close();
    return user;
  } catch (err) {
    throw err;
  }
};

module.exports = findUserById;
