const sql = require("mssql");
const getServiceDetailByName = async (req, res) => {
  try {
    console.log(req.body);
    const { serviceTypeName } = req.body;
    console.log(serviceTypeName);

    if (!serviceTypeName) {
      return res.status(400).json({ error: "Service type name is required" });
    }

    const pool = global.pool;

    if (!pool) {
      return res
        .status(500)
        .json({ error: "Database connection not initialized" });
    }

    const query = `
            SELECT s.*
            FROM Services s
            JOIN ServiceTypes st ON s.ServiceTypeID = st.ServiceTypeID
            WHERE st.ServiceTypeName = @serviceTypeName`;
    const result = await pool
      .request()
      .input("serviceTypeName", sql.VarChar, serviceTypeName)
      .query(query);
    console.log(result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.log(err);
  }
};

module.exports = getServiceDetailByName;
