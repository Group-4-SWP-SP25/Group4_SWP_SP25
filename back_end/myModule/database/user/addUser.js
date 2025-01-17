const connect = require("../connectDB.js");
const sql = require("mssql");

const addUser = async (req, res) => {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      address,
      role,
      phone,
    } = req.body;
    const pool = await connect(); // Get the connection pool

    const query = `
      INSERT INTO [User](Username, Password, FirstName, LastName, Email, Phone)
VALUES(@username, @password, @firstName, @lastName, @email, phone)
    `;
    // Example query
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .input("password", sql.VarChar, password)
      .input("password", sql.VarChar, password)
      .input("password", sql.VarChar, password)
      .query(query);

    console.log("Password updated successfully.");
    return result; // Optionally return the result
    // Close the connection (optional because `mssql` handles pooling)
  } catch (err) {
    console.error("Error updating password:", err.message);
    throw err; // Optionally re-throw the error
  }
};

module.exports = changePassword;
