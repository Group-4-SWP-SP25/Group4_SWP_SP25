const sql = require("mssql");

const GetServiceTypes = async (req, res) => {
    try {
       

        const pool = global.pool;
        const result = await pool.request()
            .query(`SELECT ServiceID, ServiceName  FROM Service s
                where s.AffectInventory=1
;`);

        const services = result.recordset || []; // Trả về mảng rỗng nếu không có dữ liệu
        //    console.log(services);
        res.json({ services });
    } catch (err) {
        console.error("Error fetching services:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = GetServiceTypes;
