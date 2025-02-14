const sql = require("mssql");

const validSortColumns = ['UserID', 'FirstName', 'Email', 'Phone', 'DateCreated'];
const validSortOrders = ['ASC', 'DESC'];

const UserList = async (firstIndex, count, searchString, sortColumn = 'UserID', sortOrder = 'ASC') => {
    try {
        const pool = global.pool;
        const searchResult = await search(searchString);
        const userIds = searchResult.map(user => user.UserID).join(",");

        if (!userIds) {
            return []; // Trả về mảng rỗng nếu không có user nào khớp với searchString
        }

        // Validate sortColumn and sortOrder
        if (!validSortColumns.includes(sortColumn)) {
            sortColumn = 'UserID';
        }
        if (!validSortOrders.includes(sortOrder)) {
            sortOrder = 'ASC';
        }

        const query = `
        SELECT *
        FROM [User]
        WHERE UserID IN (${userIds})
        ORDER BY ${sortColumn} ${sortOrder}
        OFFSET @firstIndex ROWS
        FETCH NEXT @count ROWS ONLY
        `;

        const result = await pool
            .request()
            .input("firstIndex", sql.Int, firstIndex)
            .input("count", sql.Int, count)
            .query(query);
        const userData = result.recordset;
        return userData;
    } catch (err) {
        throw err;
    }
}

const TotalUserCount = async (searchString) => {
    try {
        const pool = global.pool;
        const searchResult = await search(searchString);
        const userIds = searchResult.map(user => user.UserID).join(",");

        if (!userIds) {
            return 0; // Trả về 0 nếu không có user nào khớp với searchString
        }

        const query = `
            SELECT COUNT(*) AS TotalUserCount
            FROM [User]
            WHERE UserID IN (${userIds})
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

const search = async (searchString) => {
    try {
        const pool = global.pool;
        const query = `
            SELECT *
            FROM [User]
            WHERE firstname LIKE @searchString
            OR lastname LIKE @searchString
            OR email LIKE @searchString
            OR phone LIKE @searchString
        `;

        const result = await pool
            .request()
            .input("searchString", sql.NVarChar, `%${searchString}%`)
            .query(query);

        const userData = result.recordset;
        return userData;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    UserList,
    TotalUserCount,
    search
};