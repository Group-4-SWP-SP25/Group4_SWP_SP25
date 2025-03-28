const sql = require("mssql");

const UpdateProduct = async (req, res) => {
  try {
    const { productID, branchID, AccessoryName, Quantity, UnitPrice } = req.body;
    console.log(req.body);
    // Kiểm tra dữ liệu đầu vào
    if (!productID || !branchID || !AccessoryName || Quantity < 0 || UnitPrice < 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const pool = global.pool;

    // Kiểm tra sản phẩm có tồn tại không
    const checkResult = await pool
      .request()
      .input("productID", sql.Int, productID)
      .input("branchID", sql.Int, branchID)
      .query(`
        SELECT * FROM Inventory WHERE AccessoryID = @productID AND BranchID = @branchID
      `);

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Cập nhật sản phẩm
    const result = await pool
      .request()
      .input("AccessoryName", sql.NVarChar, AccessoryName)
      .input("Quantity", sql.Int, Quantity)
      .input("UnitPrice", sql.Decimal(18, 2), UnitPrice) 
      .input("productID", sql.Int, productID)
      .input("branchID", sql.Int, branchID)
      .query(`
        BEGIN TRANSACTION;

        -- Cập nhật tên phụ tùng
        UPDATE AccessoryInfo 
        SET AccessoryName = @AccessoryName
        WHERE AccessoryID = @productID;

        -- Cập nhật số lượng tồn kho tại chi nhánh cụ thể
        UPDATE Inventory
        SET Quantity = @Quantity, UnitPrice = @UnitPrice
        WHERE AccessoryID = @productID AND BranchID = @branchID;

        COMMIT TRANSACTION;
      `);

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = UpdateProduct;
