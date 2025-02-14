const getCarByID = async (carIDid) => {
  try {
    const pool = global.pool; // Get the connection pool
    const query = `
      SELECT * FROM [Car] WHERE CarID = @carID
    `;
    // Example query
    const result = await pool
      .request()
      .input("carID", sql.Int, carIDid)
      .query(query);

    if (result.recordset.length > 0) {
      const carData = result.recordset[0];
      return carData;
    } else {
      return null;
    }
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = getCarByID;
