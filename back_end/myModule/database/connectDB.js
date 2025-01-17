const sql = require("mssql");

const config = {
  user: "sa",
  password: "123",
  server: "localhost",
  database: "SWP_G4",
  options: {
    encrypt: false, // Set to true for Azure or false for local
    trustServerCertificate: true, // Change to true for development
  },
};

const connect = async () => {
  try {
    // Establish a connection
    const pool = await sql.connect(config);
    console.log("Connected to SQL Server!");
    return pool; // Return the connection pool
  } catch (err) {
    console.error("Error connecting to SQL Server:", err.message);
    throw err;
  }
};

module.exports = connect;
