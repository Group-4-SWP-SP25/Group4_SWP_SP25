const branchList = async (req, res) => {
  try {
    const pool = global.pool;
    const query = `
      SELECT * FROM Branch
    `;

    const result = await pool.request().query(query);
    res.send(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = branchList;
