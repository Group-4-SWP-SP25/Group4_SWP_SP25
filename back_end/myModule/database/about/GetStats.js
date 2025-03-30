const sql = require("mssql");

const GetStats = async (req, res) => {
    try {
        const pool = global.pool;

        // Chạy tất cả truy vấn một lần
        const result = await pool.request()
            .query(`
                SELECT COUNT(*) AS totalUsers FROM [User] WHERE Role = 'user';
                SELECT COUNT(*) AS totalBranches FROM Branch;
                SELECT COUNT(*) AS totalServices FROM Service;
                SELECT COUNT(*) AS totalAccessories FROM AccessoryInfo;
            `);

        // Mỗi truy vấn trả về một `recordset`, lấy giá trị đầu tiên
        const totalUsers = result.recordsets[0][0].totalUsers;
        const totalBranches = result.recordsets[1][0].totalBranches;
        const totalServices = result.recordsets[2][0].totalServices;
        const totalAccessories = result.recordsets[3][0].totalAccessories;

        const stats = {
            totalUsers,
            totalBranches,
            totalServices,
            totalAccessories
        };


        res.json(stats);
    } catch (err) {
        console.error("Error fetching stats:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = GetStats;
