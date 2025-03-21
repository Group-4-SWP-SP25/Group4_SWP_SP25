const sql = require("mssql");

const editBranchInfo = async (req, res) => {
    try {
        const { branchID, branchName, branchAddress, branchPhone, branchEmail } = req.body;
        const pool = global.pool;
        await pool.request()
            .input("branchID", sql.Int, branchID)
            .input("branchName", sql.NVarChar, branchName)
            .input("branchAddress", sql.NVarChar, branchAddress)
            .input("branchPhone", sql.NVarChar, branchPhone)
            .input("branchEmail", sql.NVarChar, branchEmail)
            .query(
                `UPDATE Branch 
                SET BranchName = @branchName, 
                BranchAddress = @branchAddress, 
                BranchPhone = @branchPhone,
                BranchEmail = @branchEmail
                WHERE BranchID = @branchID`
            );
        res.status(200).json({ message: "Branch info updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = editBranchInfo;