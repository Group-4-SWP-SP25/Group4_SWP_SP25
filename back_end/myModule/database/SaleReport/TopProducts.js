const sql = require("mssql");

const TopProducts = async (req, res) => {
  try {
    const { branch, year } = req.body;

    if (!branch || !year) {
      return res.status(400).json({ error: "Please provide year and branch" });
    }

    const pool = global.pool;
    const result = await pool
      .request()
      .input("branch", sql.NVarChar, branch)
      .input("year", sql.Int, year).query(`
       
SELECT 
    ai.AccessoryName AS ProductName, 
    sum (bi.QuantityUsed) AS Sales  
FROM AccessoryInfo ai
JOIN [Service] s ON s.ServiceID = ai.ServiceID
JOIN Bill bi ON bi.ServiceID = ai.ServiceID
JOIN Branch b ON bi.BranchID = b.BranchID
WHERE CAST(b.BranchID AS NVARCHAR(MAX)) = @branch
AND YEAR(bi.OrderDate) = @year
GROUP BY ai.AccessoryName
ORDER BY Sales DESC;
            `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = TopProducts;
