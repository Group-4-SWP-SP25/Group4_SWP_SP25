const mssql = require('mssql');

const sortService = async (req, res) => {
    try {
        const pool = global.pool;
        const { column, order } = req.body;

        const query = ` SELECT * 
                        FROM [Service] 
                        ORDER BY ${column} ${order};`;

        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = sortService;
