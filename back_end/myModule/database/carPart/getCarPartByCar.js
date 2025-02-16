const sql = require("mssql");
const getCarPartByCar = async (carId, partId) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM CarPart
      WHERE CarID = @carId AND PartID = @partId
    `;

    const result = await pool
      .request()
      .input("carId", sql.Int, carId)
      .input("partId", sql.Int, partId)
      .query(query);
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = getCarPartByCar;
