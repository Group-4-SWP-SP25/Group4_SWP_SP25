const sql = require("mssql");

const TotalNewCustomer = async (req, res) => {
    try {
        const pool = global.pool;
        const result = await pool.request()
            .query(`
                SELECT 
                    COUNT(CASE WHEN CONVERT(date, DateCreated) = CONVERT(date, GETDATE()) THEN UserID END) AS today_customers,
                    COUNT(CASE WHEN CONVERT(date, DateCreated) = CONVERT(date, DATEADD(DAY, -1, GETDATE())) THEN UserID END) AS yesterday_customers
                FROM [User]
            `);

        const todayCustomers = result.recordset[0].today_customers || 0;
        const yesterdayCustomers = result.recordset[0].yesterday_customers || 0;

        let percentChange = 0;
        if (yesterdayCustomers > 0) {
            percentChange = ((todayCustomers - yesterdayCustomers) / yesterdayCustomers) * 100;
        }

        res.json({
            totalCustomers: todayCustomers,
            percentChange: percentChange.toFixed(2)
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = TotalNewCustomer;
