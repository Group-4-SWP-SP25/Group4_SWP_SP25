const sql = require("mssql");
const getListPartBySystem = async (carSystemID) => {
  try {
    const pool = global.pool; // Get the connection pool
    const query = `
      SELECT * FROM PartInfo WHERE CarSystemID = @carSystemID
    `;
    // Example query
    const result = await pool
      .request()
      .input("carSystemID", sql.Int, carSystemID)
      .query(query);

    const carPartData = result.recordset;
    return carPartData;
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = getListPartBySystem;
