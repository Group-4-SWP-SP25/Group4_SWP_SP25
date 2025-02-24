const sql = require('mssql');
const getCarList = async (req, res) => {
    try {
        const pool = global.pool;
        
        if (!pool) {
            return res.status(500).json({ error: 'Database connection not initialized' });
        }

        const query = `
            SELECT * FROM [Car]`;
        
        const result = await pool.request().query(query);

        res.json(result.recordset);
    } catch (err) {
        console.log('Error', err);
    }
};

module.exports = getCarList;