const sql = require("mssql");
const getAllCartPart = async (carID) => {
  try {
    const pool = global.pool; // Get the connection pool
    const query = `
      SELECT * FROM [CarPart] WHERE CarID = @carID
    `;
    // Example query
    const result = await pool
      .request()
      .input("carID", sql.Int, carID)
      .query(query);

    const carPartData = result.recordset;
    return carPartData;
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = getAllCartPart;
