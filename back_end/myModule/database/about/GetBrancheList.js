const sql = require("mssql");

const GetBrancheList = async (req, res) => {
    console.log("alooooooo");
    try {
        const pool = global.pool;

       
      
        const result = await pool.request().query(`
            SELECT BranchID, BranchName FROM Branch
        `);

        console.log("Kết quả truy vấn danh sách chi nhánh:", result.recordset);

     
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching branches:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = GetBrancheList;
