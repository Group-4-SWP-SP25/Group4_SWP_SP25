const listCarSystem = async (req, res) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM CarSystem
    `;

    const result = await pool.request().query(query);
    res.status(200).send(result.recordset);
  } catch (err) {
    throw err;
  }
};

module.exports = listCarSystem;
