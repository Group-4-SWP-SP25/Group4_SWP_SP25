const connect = require("../connectDB");
const sql = require("mssql");
const User = require("../../model/user");

const updateProfile = async (req, res) => {
  try {
    const pool = global.pool;
    // Get data to update profile from client
    const { id, firstName, lastName, email, address, phone } = req.body;

    // Sql statement
    const query = `UPDATE [User] SET FirstName = @firstName, LastName = @lastName, Email = @email, Address = @address, Phone = @phone WHERE UserID = @id`;

    // Result
    await pool
      .request()
      .input("firstName", sql.VarChar, firstName)
      .input("lastName", sql.VarChar, lastName)
      .input("email", sql.VarChar, email)
      .input("address", sql.VarChar, address)
      .input("phone", sql.VarChar, phone)
      .input("id", sql.input, id)
      .query(query);
  } catch (err) {
    throw err;
  }
};
