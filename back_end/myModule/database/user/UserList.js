const sql = require("mssql");

const validSortColumns = [
  "UserID",
  "FirstName",
  "Email",
  "Phone",
  "DateCreated",
];
const validSortOrders = ["ASC", "DESC"];

const UserList = async (
  firstIndex,
  count,
  searchString,
  sortColumn = "UserID",
  sortOrder = "ASC"
) => {
  try {
    const pool = global.pool;
    const searchResult = await search(searchString);
    const userIds = searchResult.map((user) => user.UserID).join(",");
    if (!userIds) {
      return []; // Trả về mảng rỗng nếu không có user nào khớp với searchString
    }

    // Validate sortColumn and sortOrder
    if (!validSortColumns.includes(sortColumn)) {
      sortColumn = "UserID";
    }
    if (!validSortOrders.includes(sortOrder)) {
      sortOrder = "ASC";
    }

    const query = `
        SELECT UserID, FirstName, LastName, Email, Address, Role, Phone, DateCreated, DOB, LastActivity
        FROM [User]
        WHERE UserID IN (${userIds}) AND Role = 'User'
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
    console.log(err);
    throw err;
  }
};

const TotalUserCount = async (searchString) => {
  try {
    const pool = global.pool;
    const searchResult = await search(searchString);
    const userIds = searchResult.map((user) => user.UserID).join(",");

    if (!userIds) {
      return 0; // Trả về 0 nếu không có user nào khớp với searchString
    }

    let list = [];
    for (let user of searchResult) list.push(user.UserID);

    return list;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const search = async (searchString) => {
  try {
    const pool = global.pool;
    const query = `
            SELECT *
            FROM [User]
            WHERE 
            (FirstName LIKE @searchString 
            OR LastName LIKE @searchString
            OR Email LIKE @searchString
            OR Phone LIKE @searchString)
            
        `;

    const result = await pool
      .request()
      .input("searchString", sql.NVarChar, `%${searchString}%`)
      .query(query);

    const userData = result.recordset;
    return userData;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  UserList,
  TotalUserCount,
  search,
};
