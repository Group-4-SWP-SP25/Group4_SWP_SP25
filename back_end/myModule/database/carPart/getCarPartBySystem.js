const sql = require("mssql");
const getCarPartBySystem = async (carID, carSystemID) => {
  try {
    const pool = global.pool; // Get the connection pool
    const query = `
      SELECT * FROM [CarPart] WHERE CarID = @carID AND CarSystemID = @carSystemID
    `;
    // Example query
    const result = await pool
      .request()
      .input("carID", sql.Int, carID)
      .input("carSystemID", sql.Int, carSystemID)
      .query(query);

    const carPartData = result.recordset;
    return carPartData;
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = getCarPartBySystem;
