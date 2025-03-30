const sql = require("mssql");

const branchDetail = async (req, res) => {
    try {
        const pool = global.pool; 
        const result = await pool.request().query(`
            SELECT BranchName, BranchAddress, BranchPhone, BranchEmail FROM Branch
        `);

    
        const branches = result.recordset.map(branch => ({
            branchID: branch.BranchID,
            branchName: branch.BranchName,
            branchAddress: branch.BranchAddress,
            branchPhone: branch.BranchPhone,
            branchEmail: branch.BranchEmail
        }));

        res.json(branches);
    } catch (err) {
        console.error("Error fetching branches:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = branchDetail;
