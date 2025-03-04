const sql = require('mssql');
const getServiceListAll = async (req, res) => {
    try {
        const pool = global.pool;
        const query = `SELECT * FROM [Service]`;
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        console.log(err);
    }
};

module.exports = getServiceListAll;
