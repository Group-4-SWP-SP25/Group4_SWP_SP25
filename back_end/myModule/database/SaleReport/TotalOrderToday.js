const sql = require("mssql");

const TotalOrderToday = async (req, res) => {
    try {
        const pool = global.pool;
        const result = await pool.request()
            .query(`
                SELECT 
                    COUNT(CASE WHEN CONVERT(date, OrderDate) = CONVERT(date, GETDATE()) THEN OrderID END) AS today_orders,
                    COUNT(CASE WHEN CONVERT(date, OrderDate) = CONVERT(date, DATEADD(DAY, -1, GETDATE())) THEN OrderID END) AS yesterday_orders
                FROM [Order]
            `);

        const todayOrders = result.recordset[0].today_orders || 0;
        const yesterdayOrders = result.recordset[0].yesterday_orders || 0;

        let percentChange = 0;
        if (yesterdayOrders > 0) {
            percentChange = ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100;
        }

        res.json({
            totalOrders: todayOrders,
            percentChange: percentChange.toFixed(2) 
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = TotalOrderToday;
