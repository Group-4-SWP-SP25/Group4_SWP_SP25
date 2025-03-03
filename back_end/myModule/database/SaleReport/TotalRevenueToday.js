const sql = require("mssql");
const TotalRevenueToday = async () => {
    try {
        const pool = global.pool;
        const result = await pool.request()
            .query(`
                SELECT SUM(TotalPrice) AS TotalRevenue
                FROM [Order] 
                WHERE CONVERT(date, OrderDate) = CONVERT(date, GETDATE())
            `);
        return result.recordset[0];
    } catch (err) {
        throw err;
    }
}
module.exports = TotalRevenueToday;