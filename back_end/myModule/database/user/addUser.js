const connect = require("../connectDB.js");
const sql = require("mssql");
const User = require("../../model/user.js");

const addUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const pool = await connect(); // Get the connection pool

    const query = `
      INSERT INTO [User](Username, Password, FirstName, LastName, Email, Phone)
VALUES(@username, @password, @firstName, @lastName, @email, @phone)
    `;
    // Example query
    const result = await pool
      .request()
      .input("username", sql.VarChar, user.name)
      .input("password", sql.VarChar, user.password)
      .input("firstName", sql.VarChar, user.firstName)
      .input("lastName", sql.VarChar, user.lastName)
      .input("email", sql.VarChar, user.email)
      .input("phone", sql.VarChar, user.phone)
      .query(query);

    console.log("Password updated successfully.");
    return result; // Optionally return the result
    // Close the connection (optional because `mssql` handles pooling)
  } catch (err) {
    console.error("Error updating password:", err.message);
    throw err; // Optionally re-throw the error
  }
};

module.exports = addUser;
