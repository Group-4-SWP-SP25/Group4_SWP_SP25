const mssql = require('mssql');

const sortService = async (req, res) => {
    try {
        const pool = global.pool;
        const { column, order } = req.body;

        const query = ` SELECT
                            s.*,
                            st.ServiceTypeName,
                            pi.PartName
                        FROM
                            Service s
                        LEFT JOIN
                            ServiceType st ON s.ServiceTypeID = st.ServiceTypeID
                        LEFT JOIN
                            PartInfo pi ON s.PartID = pi.PartID 
                        ORDER BY ${column} ${order};`;

        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = sortService;
