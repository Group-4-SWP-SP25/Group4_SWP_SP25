const sql = require("mssql");

const TotalQuantity = async (req, res) => {
    try {
        const pool = global.pool;
        const result = await pool.request()
            .query(`SELECT SUM(Quantity) AS TotalQuantity FROM Inventory;`);

        const totalQuantity = result.recordset[0].TotalQuantity || 0;

        res.json({
            totalQuantity: totalQuantity
        });
    } catch (err) {
        console.error("Error fetching total quantity:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = TotalQuantity;
