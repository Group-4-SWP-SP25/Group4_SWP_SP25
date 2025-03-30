const sql = require("mssql");

const calQuantityInOrder = async (branchID, accessoryID) => {
  try {
    const pool = global.pool;
    const query = `
        SELECT COALESCE(SUM(o.QuantityUsed), 0) AS TotalQuantityAccessoryInOrder
        FROM Inventory AS i
        INNER JOIN AccessoryInfo AS af ON af.AccessoryID = i.AccessoryID
        INNER JOIN [Service] AS s ON s.ServiceID = af.ServiceID
        INNER JOIN [Order] AS o ON o.ServiceID = s.ServiceID
        WHERE i.BranchID = @branchID AND i.AccessoryID = @accessoryID;
    `;

    const result = await pool
      .request()
      .input("branchID", sql.Int, branchID)
      .input("accessoryID", sql.Int, accessoryID)
      .query(query);
    return result.recordset[0].TotalQuantityAccessoryInOrder;
  } catch (err) {
    throw err;
  }
};

module.exports = calQuantityInOrder;
