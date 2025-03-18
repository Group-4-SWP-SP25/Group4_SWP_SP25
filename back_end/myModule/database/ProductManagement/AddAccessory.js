const sql = require("mssql");

const AddAccessory = async (req, res) => {
    try {
        const { AccessoryName, ServiceTypeID, Description, BranchID, Quantity, UnitPrice } = req.body;

        if (!AccessoryName || !ServiceTypeID || !BranchID || Quantity <= 0 || UnitPrice <= 0) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        const pool = global.pool;
        const transaction = new sql.Transaction(pool);

        await transaction.begin();

        try {
            // Thêm accessory vào bảng AccessoryInfo
            const accessoryResult = await transaction.request()
                .input("AccessoryName", sql.NVarChar, AccessoryName)
                .input("ServiceID", sql.Int, ServiceTypeID)
                .input("Description", sql.NVarChar, Description)
                .input("AddDate", sql.DateTime, new Date())
                .query(`
                    INSERT INTO AccessoryInfo (AccessoryName, ServiceID, Description, AddDate)
                    OUTPUT INSERTED.AccessoryID
                    VALUES (@AccessoryName, @ServiceID, @Description, @AddDate);
                `);

            const AccessoryID = accessoryResult.recordset[0].AccessoryID;

            // Thêm vào Inventory của branch
            await transaction.request()
                .input("BranchID", sql.Int, BranchID)
                .input("AccessoryID", sql.Int, AccessoryID)
                .input("Quantity", sql.Int, Quantity)
                .input("UnitPrice", sql.Decimal(10, 2), UnitPrice)
                .query(`
                    INSERT INTO Inventory (BranchID, AccessoryID, Quantity, UnitPrice)
                    VALUES (@BranchID, @AccessoryID, @Quantity, @UnitPrice);
                `);

            await transaction.commit();
            res.status(201).json({ message: "Accessory added successfully", AccessoryID });

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (err) {
        console.error("Error adding accessory:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = AddAccessory;
