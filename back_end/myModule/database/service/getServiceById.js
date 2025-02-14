const getServiceById = async (serviceId) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM Service
      WHERE ServiceID = @serviceId
    `;

    const result = await pool
      .request()
      .input("serviceId", sql.Int, serviceId)
      .query(query);
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = getServiceById;
