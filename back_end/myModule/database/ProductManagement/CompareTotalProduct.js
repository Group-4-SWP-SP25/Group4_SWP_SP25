const sql = require("mssql");

const CompareTotalProduct = async (req, res) => {
    try {
        const pool = global.pool;
        const result = await pool.request()
            .query(`
                SELECT 
    SUM(CASE 
            WHEN YEAR(OrderDate) = YEAR(GETDATE()) 
            AND MONTH(OrderDate) = MONTH(GETDATE()) 
            THEN QuantityUsed 
            ELSE 0 
        END) AS this_month_products,
        
    SUM(CASE 
            WHEN YEAR(OrderDate) = YEAR(DATEADD(MONTH, -1, GETDATE())) 
            AND MONTH(OrderDate) = MONTH(DATEADD(MONTH, -1, GETDATE())) 
            THEN QuantityUsed 
            ELSE 0 
        END) AS last_month_products
FROM [Order];

            `);

        const thisMonthProducts = result.recordset[0].this_month_products || 0;
        const lastMonthProducts = result.recordset[0].last_month_products || 0;

        let percentChange = 0;
        if (lastMonthProducts > 0) {
            percentChange = ((thisMonthProducts - lastMonthProducts) / lastMonthProducts) * 100;
        }
        console.log("thisMonthProducts", thisMonthProducts);
        res.json({
            totalProductThisMonth: thisMonthProducts,
            percentChange1: percentChange.toFixed(2) 
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = CompareTotalProduct;
