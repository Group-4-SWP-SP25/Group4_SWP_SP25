const sql = require("mssql");

const GetBranchesDetail = async (req, res) => {
    try {
        const pool = global.pool;

        // Kiểm tra kết nối database
        if (!pool) {
            return res.status(500).json({ error: "Database connection not initialized" });
        }

        // Lấy branchID từ body
        const { branchID } = req.body;
        if (!branchID) {
            return res.status(400).json({ error: "Missing branchID" });
        }

        // Truy vấn thông tin chi tiết của chi nhánh
        const result = await pool.request()
            .input("branchID", sql.Int, branchID)
            .query(`
                SELECT BranchPhone, BranchEmail 
                FROM Branch 
                WHERE BranchID = @branchID
            `);

        console.log("Kết quả truy vấn:", result.recordset);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Branch not found" });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error("Lỗi khi lấy thông tin chi nhánh:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = GetBranchesDetail;
