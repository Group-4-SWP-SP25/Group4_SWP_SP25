const sql = require("mssql");

const TotalRevenueToday = async (req, res) => {
    try {
        const pool = global.pool;
        const result = await pool.request()
            .query(`
                SELECT 
                    SUM(CASE WHEN CONVERT(date, OrderDate) = CONVERT(date, GETDATE()) THEN EstimatedCost ELSE 0 END) AS today_sales,
                    SUM(CASE WHEN CONVERT(date, OrderDate) = CONVERT(date, DATEADD(DAY, -1, GETDATE())) THEN EstimatedCost ELSE 0 END) AS yesterday_sales
                FROM [Order]
            `);

        const todaySales = result.recordset[0].today_sales || 0;
        const yesterdaySales = result.recordset[0].yesterday_sales || 0;

        let percentChange = 0;
        if (yesterdaySales > 0) {
            percentChange = ((todaySales - yesterdaySales) / yesterdaySales) * 100;
        }
    res.json({
            totalSales: todaySales,
            percentChange: percentChange.toFixed(2)
        });
    } catch (err) {
        throw err;
    }
};

module.exports = TotalRevenueToday;
