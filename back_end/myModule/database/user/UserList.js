const sql = require("mssql");

const UserList = async (firstIndex, lastIndex) => {
    try {
        const pool = global.pool;
        const query = `
        SELECT *
        FROM [User]
        WHERE (UserID BETWEEN @firstIndex AND @lastIndex)
        `;

        const result = await pool
            .request()
            .input("firstIndex", sql.Int, firstIndex)
            .input("lastIndex", sql.Int, lastIndex)
            .query(query);
        const userData = result.recordset;
        return userData;
    } catch (err) {
        throw err;
    }
}

const TotalUserCount = async () => {
    try {
        const pool = global.pool;
        const query = `
            SELECT COUNT(*) AS TotalUserCount
            FROM [User]
        `;

        const result = await pool
            .request()
            .query(query);

        const totalUserCount = result.recordset[0].TotalUserCount;
        return totalUserCount;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    UserList,
    TotalUserCount
};