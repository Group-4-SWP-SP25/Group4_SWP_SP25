// const sql = require("mssql");

// const DeleteProduct = async (req, res) => {
//     try {
//         const { productID } = req.body;  // Lấy productID từ body

//         if (!productID) {
//             return res.status(400).json({ message: "Thiếu productID trong request." });
//         }

//         const pool = global.pool;

//         // 1️⃣ Kiểm tra xem sản phẩm có nằm trong dịch vụ hoặc đơn hàng không
//         const checkOrder = await pool.request()
//             .input("productID", sql.Int, productID)
//             .query(`
//                 SELECT O.OrderID 
//                 FROM [Order] O
//                 JOIN Service S ON O.ServiceID = S.ServiceID
//                 WHERE S.PartID = @productID
//             `);

//         if (checkOrder.recordset.length > 0) {
//             return res.status(400).json({
//                 message: "Sản phẩm đã có trong đơn hàng, không thể xóa."
//             });
//         }

//         // 2️⃣ Xóa sản phẩm khỏi Inventory trước
//         await pool.request()
//             .input("productID", sql.Int, productID)
//             .query("DELETE FROM Inventory WHERE AccessoryID = @productID");

//         // 3️⃣ Xóa sản phẩm khỏi Service nếu có
//         await pool.request()
//             .input("productID", sql.Int, productID)
//             .query("DELETE FROM Service WHERE PartID = @productID");

//         // 4️⃣ Xóa sản phẩm khỏi AccessoryInfo
//         await pool.request()
//             .input("productID", sql.Int, productID)
//             .query("DELETE FROM AccessoryInfo WHERE AccessoryID = @productID");

//         res.json({ message: "Xóa sản phẩm thành công!" });

//     } catch (error) {
//         console.error("Lỗi khi xóa sản phẩm:", error);
//         res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
//     }
// };

// module.exports = DeleteProduct;


const sql = require("mssql");

const DeleteProduct = async (req, res) => {
    try {
        const { productID, branchID } = req.body;
        console.log(req.body);

      


    

        if (!productID ||!branchID) {
            return res.status(400).json({ message: "Thiếu hoặc sai định dạng productID hoặc branchID." });
        }

        const pool = global.pool;

        // 1️⃣ Kiểm tra xem sản phẩm có trong đơn hàng không
        const checkOrder = await pool.request()
            .input("productID", sql.Int, productID)
            .input("branchID", sql.Int, branchID)
            .query(`
                SELECT O.OrderID 
                FROM [Order] O
                JOIN Service S ON O.ServiceID = S.ServiceID
                WHERE S.PartID = @productID
                AND O.BranchID = @branchID         
            `);

        if (checkOrder.recordset.length > 0) {
            return res.status(400).json({
                message: "Sản phẩm đã có trong đơn hàng tại chi nhánh này, không thể xóa."
            });
        }
console.log(checkOrder);
        // 2️⃣ Xóa sản phẩm theo branchID trong Inventory
        await pool.request()
            .input("productID", sql.Int, productID)
            .input("branchID", sql.Int,branchID)
            .query("DELETE FROM Inventory WHERE AccessoryID = @productID AND BranchID = @branchID");

        // 3️⃣ Xóa sản phẩm theo branchID trong Service (nếu có)
        await pool.request()
            .input("productID", sql.Int, productID)
            .input("branchID", sql.Int, branchID)
            .query("DELETE FROM Service WHERE PartID = @productID");

        // 4️⃣ Kiểm tra nếu sản phẩm không còn ở bất kỳ chi nhánh nào => xóa khỏi AccessoryInfo
        const checkOtherBranches = await pool.request()
            .input("productID", sql.Int, productID)
            .query("SELECT * FROM Inventory WHERE AccessoryID = @productID");

        if (checkOtherBranches.recordset.length === 0) {
            await pool.request()
                .input("productID", sql.Int, productID)
                .query("DELETE FROM AccessoryInfo WHERE AccessoryID = @productID");
        }

        res.json({ message: "Xóa sản phẩm thành công!" });

    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
    }
};

module.exports = DeleteProduct;


