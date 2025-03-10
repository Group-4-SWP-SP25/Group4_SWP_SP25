const sql = require("mssql");

const TopRevenueByMonth = async (req, res) => {
    try {
        const year = req.body.year;
        if (!year) {
            return res.status(400).json({ error: "Year parameter is required" });
        }
        
        
        
        const pool = global.pool;
        const result = await pool.request()
        .input("year", sql.Int, year)
        .query(`
            SELECT 
            MONTH(OrderDate) AS month, 
            SUM(EstimatedCost) AS total_revenue
                FROM [Order]
                WHERE YEAR(OrderDate) = @year
                GROUP BY MONTH(OrderDate)
            `);

        // Tạo mảng 12 tháng
        let monthlyRevenue = Array(12).fill(0);

        // Gán doanh thu vào đúng tháng
        result.recordset.forEach(row => {
            monthlyRevenue[row.month - 1] = row.total_revenue;
        });

        res.json({ year: year, monthlyRevenue: monthlyRevenue });

    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = TopRevenueByMonth;
