const sql = require("mssql");

const TopService = async (req, res) => {
    try {
        const pool = global.pool;
        const result = await pool.request()
            .query(`
             SELECT 
    s.ServiceID, 
    s.ServiceName, 
    COUNT (*) AS TotalOrders
FROM Service s
LEFT JOIN Bill b ON s.ServiceID = b.ServiceID
WHERE b.TotalPrice > 0 
GROUP BY s.ServiceID, s.ServiceName
ORDER BY TotalOrders DESC;
            `);

        res.json(result.recordset); // Trả về danh sách service cùng số lượng order

    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = TopService;
