const sql = require("mssql");

const insertBill = async (bill) => {
  const pool = global.pool;

  const query = `
    INSERT INTO Bill (UserID, PaymentID, CarID, PartID, ServiceID, BranchID, QuantityUsed) VALUES (@userID, @paymentID, @carID, @partID, @serviceID, @branchID, @quantityUsed);
  `;

  await pool
    .request()
    .input("userID", sql.Int, bill.userID)
    .input("paymentID", sql.Int, bill.paymentID)
    .input("carID", sql.Int, bill.carID)
    .input("partID", sql.Int, bill.partID)
    .input("serviceID", sql.Int, bill.serviceID)
    .input("branchID", sql.Int, bill.branchID)
    .input("quantityUsed", sql.Int, bill.quantityUsed)
    .query(query);
};

module.exports = insertBill;
