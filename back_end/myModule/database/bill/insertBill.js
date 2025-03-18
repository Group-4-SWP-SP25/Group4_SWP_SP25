const sql = require("mssql");

const insertBill = async (bill) => {
  const pool = global.pool;

  const query = `
    INSERT INTO Bill (UserID, PaymentID, PartID, ServiceID, BranchID, QuantityUsed, TotalPrice, OrderDate) VALUES (@userID, @paymentID, @partID, @serviceID, @branchID, @quantityUsed, @totalPrice, @orderDate);
  `;

  await pool
    .request()
    .input("userID", sql.Int, bill.userID)
    .input("paymentID", sql.Int, bill.paymentID)
    .input("partID", sql.Int, bill.partID)
    .input("serviceID", sql.Int, bill.serviceID)
    .input("branchID", sql.Int, bill.branchID)
    .input("quantityUsed", sql.Int, bill.quantityUsed)
    .input("totalPrice", sql.Int, bill.totalPrice)
    .input("orderDate", sql.Date, bill.orderDate)
    .query(query);
};

module.exports = insertBill;
