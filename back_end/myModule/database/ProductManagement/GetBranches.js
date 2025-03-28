const sql = require("mssql");

const GetBranches = async (req, res) => {
    try {
        const pool = global.pool;
        const result = await pool.request()
            .query(`SELECT BranchID, BranchName FROM Branch;`);

        const branches = result.recordset || [];
        console.log(branches);
        res.json({ branches });
    } catch (err) {
        console.error("Error fetching branches:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = GetBranches;
