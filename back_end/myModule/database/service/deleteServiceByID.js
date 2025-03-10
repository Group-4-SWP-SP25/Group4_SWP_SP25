const sql = require('mssql');

const deleteServiceById = async (req, res) => {
    try {
        const pool = global.pool;
        const { serviceID } = req.body;

        const query = `
                        -- Xóa từ bảng Inventory (bảng con 2)
                        DELETE FROM Inventory
                        WHERE AccessoryID IN (
                            SELECT AccessoryID
                            FROM AccessoryInfo
                            WHERE ServiceID = @serviceID
                        );

                        -- Xóa từ bảng AccessoryInfo (bảng con 1)
                        DELETE FROM AccessoryInfo
                        WHERE ServiceID = @serviceID;

                        -- Xóa từ bảng Service (bảng cha)
                        DELETE FROM Service
                        WHERE ServiceID = @serviceID;
                    `;

        const result = await pool.request().input('serviceID', sql.Int, serviceID).query(query);

        if (result.rowsAffected[0] === 0) {
            console.log(`Failed to delete service with ID = ${serviceID}`);
            return { success: false }; // Return failure status
        }
        console.log(`Deleted service with ID = ${serviceID}`);
        return { success: result.rowsAffected[0] > 0 }; // Return success status
    } catch (err) {
        console.error(`Error deleting service with ID = ${serviceID}:`, err);
        return { success: false, error: err.message }; // Return error status
    }
};

module.exports = deleteServiceById;
