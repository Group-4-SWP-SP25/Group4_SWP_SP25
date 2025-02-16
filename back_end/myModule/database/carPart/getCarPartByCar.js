const getCarPartByCar = async (carId, partID) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM CarPart
      WHERE CarID = @carId AND PartID = @partID
    `;

    const result = await pool
      .request()
      .input("carId", sql.Int, carId)
      .input("partID", sql.Int, partID)
      .query(query);
    return result.recordset;
  } catch (err) {
    throw err;
  }
};

module.exports = getCarPartByCar;
