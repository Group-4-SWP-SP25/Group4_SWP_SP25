const sql = require("mssql");

const insertOrder = async (order) => {
  try {
    const pool = global.pool;

    const query = `INSERT INTO [Order](UserID, CarID, PartID, ServiceID, BranchID, QuantityUsed) VALUES (@userID, @carID, @partID, @serviceID, @branchID, @quantityUsed);`;

    await pool
      .request()
      .input("userID", sql.Int, order.userID)
      .input("carID", sql.Int, order.carID)
      .input("partID", sql.Int, order.partID)
      .input("serviceID", sql.Int, order.serviceID)
      .input("branchID", sql.Int, order.branchID)
      .input("quantityUsed", sql.Int, order.quantityUsed)
      .query(query);
  } catch (err) {
    throw err;
  }
};

module.exports = insertOrder;
