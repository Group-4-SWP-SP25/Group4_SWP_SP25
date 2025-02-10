// const sql = require("mssql");

// const CheckPassword = async (id, password) => {
//   try {
//     const pool = global.pool; // Get the connection pool

//     // query
//     const query = `
//       SELECT * FROM [User] WHERE UserID = @id AND Password = @password
//     `;
//     const result = await pool
//       .request()
//       .input("id", sql.Int, id)
//       .input("password", sql.VarChar, password)
//       .query(query);

//     // get result
//     if (result.recordset.length > 0) {
//       return true;
//     } else {
//       console.log("Account does not exist.");
//       return false;
//     }
//   } catch (err) {
//     console.log("Error", err);
//   }
// };

// module.exports = CheckPassword;
