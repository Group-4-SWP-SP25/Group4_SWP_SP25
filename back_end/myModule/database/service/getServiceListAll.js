const sql = require('mssql');
const getServiceListAll = async (req, res) => {
    try {
        const pool = global.pool;
        const query = ` SELECT
                            s.*,
                            st.ServiceTypeName,
                            pi.PartName
                        FROM
                            Service s
                        LEFT JOIN
                            ServiceType st ON s.ServiceTypeID = st.ServiceTypeID
                        LEFT JOIN
                            PartInfo pi ON s.PartID = pi.PartID`;
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        console.log(err);
    }
};

module.exports = getServiceListAll;
