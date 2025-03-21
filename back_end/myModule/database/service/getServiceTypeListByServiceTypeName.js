const sql = require('mssql');
const getServiceTypeListByServiceTypeName = async (req, res) => {
    try {
        const { serviceTypeName } = req.body;

        if (!serviceTypeName) {
            return res.status(400).json({ error: 'Service type name is required' });
        }

        const pool = global.pool;

        if (!pool) {
            return res.status(500).json({ error: 'Database connection not initialized' });
        }

        const query = ` SELECT st.ServiceTypeName, st.ServiceTypeDescription, s.*
                        FROM [Service] s 
                        JOIN [ServiceType] st ON s.ServiceTypeID = st.ServiceTypeID 
                        WHERE st.ServiceTypeName = @serviceTypeName`;
        const result = await pool.request().input('serviceTypeName', sql.VarChar, serviceTypeName).query(query);
        res.json(result.recordset);
    } catch (err) {
        console.log(err);
    }
};

module.exports = getServiceTypeListByServiceTypeName;
