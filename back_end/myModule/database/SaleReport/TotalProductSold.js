const sql = require("mssql");

const TotalProductSold = async (req, res) => {
    try {
        const pool = global.pool;
        const result = await pool.request()
            .query(`
                SELECT 
                    SUM(CASE WHEN CONVERT(date, OrderDate) = CONVERT(date, GETDATE()) THEN QuantityUsed ELSE 0 END) AS today_products,
                    SUM(CASE WHEN CONVERT(date, OrderDate) = CONVERT(date, DATEADD(DAY, -1, GETDATE())) THEN QuantityUsed ELSE 0 END) AS yesterday_products
                FROM [Order]
            `);

        const todayProducts = result.recordset[0].today_products || 0;
        const yesterdayProducts = result.recordset[0].yesterday_products || 0;

        let percentChange = 0;
        if (yesterdayProducts > 0) {
            percentChange = ((todayProducts - yesterdayProducts) / yesterdayProducts) * 100;
        }

        res.json({
            totalProducts: todayProducts,
            percentChange: percentChange.toFixed(2) 
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = TotalProductSold;


