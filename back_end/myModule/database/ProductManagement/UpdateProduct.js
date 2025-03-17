    const sql = require("mssql");

    const UpdateProduct = async (req, res) => {
        try {
            const { productID, branchID, AccessoryName, Quantity } = req.body;

            if (!productID || !branchID || !AccessoryName || Quantity < 0) {
                return res.status(400).json({ message: "Invalid input data" });
            }

            const pool = global.pool;
            const result = await pool.request()
                .input("AccessoryName", sql.NVarChar, AccessoryName)
                .input("Quantity", sql.Int, Quantity)
                .input("productID", sql.Int, productID)
                .input("branchID", sql.Int, branchID)
                .query(`
                    UPDATE Accessories 
                    SET AccessoryName = @AccessoryName, Quantity = @Quantity
                    WHERE AccessoryID = @productID AND BranchID = @branchID
                `);

            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.json({ message: "Product updated successfully" });
        } catch (err) {
            console.error("Error updating product:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };

    module.exports = UpdateProduct;
