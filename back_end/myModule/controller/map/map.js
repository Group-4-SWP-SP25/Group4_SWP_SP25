const sql = require("mssql");

const getBranchLocation = async (req, res) => {
    try {
        const { branchID } = req.body;
        const pool = global.pool;
        const query = `
            SELECT BranchLocation FROM Branch
            WHERE BranchID = @branchID
        `;

        const result = await pool.request()
            .input("branchID", sql.Int, branchID)
            .query(query);

        if (result.recordset.length > 0) {
            const branchLocation = result.recordset[0].BranchLocation;
            res.status(200).json({ branchLocation });
        } else {
            res.status(404).json({ message: "Branch not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const saveBranchLocation = async (req, res) => {
    try {
        const { branchID, branchLocation } = req.body;
        const pool = global.pool;
        const query = `
            UPDATE Branch
            SET BranchLocation = @branchLocation
            WHERE BranchID = @branchID
        `;

        const result = await pool.request()
            .input("branchID", sql.Int, branchID)
            .input("branchLocation", sql.NVarChar, branchLocation)
            .query(query);

        if (result.rowsAffected > 0) {
            res.status(200).json({ message: "Branch location updated successfully" });
        } else {
            res.status(404).json({ message: "Branch not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { getBranchLocation, saveBranchLocation };