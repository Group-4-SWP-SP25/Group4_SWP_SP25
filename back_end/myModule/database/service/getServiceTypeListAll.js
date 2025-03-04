const sql = require('mssql');
const getServiceTypeListAll = async (req, res) => {
    try {
        const pool = global.pool;
        const query = `SELECT * FROM [ServiceType]`;
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        console.log(err);
    }
};

module.exports = getServiceTypeListAll;
