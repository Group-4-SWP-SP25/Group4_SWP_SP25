const sql = require("mssql");

const ProductOverview = async (req, res) => {
    try {
        const pool = global.pool;
       const result = await pool.request()
            .query(`SELECT i.AccessoryID, ai.AccessoryName, b.BranchName, i.Quantity,b.BranchID, i.UnitPrice
                    FROM Inventory i
                    JOIN AccessoryInfo ai ON i.AccessoryID = ai.AccessoryID
                    JOIN Branch b ON i.BranchID = b.BranchID;`);

        
                    if (result.recordset.length === 0) {
                        return res.status(404).json({ message: "No data found" });
                    }
                    res.json(result.recordset);

    } catch (err) {
        console.error("Error fetching product overview:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = ProductOverview;

