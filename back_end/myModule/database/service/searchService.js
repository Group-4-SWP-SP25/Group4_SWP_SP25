const mssql = require('mssql');

const searchService = async (req, res) => {
    try {
        const pool = global.pool;
        const { input } = req.body;

        const query = ` SELECT *
                        FROM [Service]
                        WHERE ServiceName LIKE @input
                        OR ServiceDescription LIKE @input`;
        
        const result = await pool.request().input('input', mssql.VarChar, `%${input}%`).query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = searchService;
