const sql = require("mssql");

const addUser = async (user) => {
  try {
    const pool = global.pool; // Get the connection pool
    const query = `
      INSERT INTO [User](UserName, Password, FirstName, LastName, Email, Address, Phone)
VALUES(@userName, @password, @firstName, @lastName, @email, @address, @phone);
    `;
    // Example query
    const result = await pool
      .request()
      .input("userName", sql.VarChar, user.username)
      .input("password", sql.VarChar, user.password)
      .input("firstName", sql.VarChar, user.firstName)
      .input("lastName", sql.VarChar, user.lastName)
      .input("email", sql.VarChar, user.email)
      .input("address", sql.VarChar, user.address)
      .input("phone", sql.VarChar, user.phone)
      .query(query);

    console.log("Add user successfully.");
    return 1; // Optionally return the result
    // Close the connection (optional because `mssql` handles pooling)
  } catch (err) {
    console.error("Error add user:", err.message);
    return -1; // Optionally re-throw the error
  }
};

module.exports = addUser;
