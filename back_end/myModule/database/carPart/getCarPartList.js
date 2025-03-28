const sql = require("mssql");

const getCarPartList = async (carID) => {
  try {
    const pool = global.pool;
    const query = `SELECT * FROM [CarPart] WHERE CarID = @carID`;
    const result = await pool
      .request()
      .input("carID", sql.Int, carID)
      .query(query);
    return result.recordset;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = getCarPartList;
