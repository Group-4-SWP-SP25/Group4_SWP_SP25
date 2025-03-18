const sql = require('mssql')

const UpdateCarPart = async (carID, parts) => {
    const pool = global.pool;
    for (let part of parts) {
        try {
            const query = `
                UPDATE CarPart
                    SET 
                        InstallationDate = @InstallationDate, 
                        ExpiryDate = @ExpiryDate, 
                        [Status] = @Status
                    WHERE 
                        CarID = @carID
                    AND 
                        PartID = @partID
                `;

            await pool
                .request()
                .input("InstallationDate", sql.DateTime, part.InstallationDate)
                .input("ExpiryDate", sql.DateTime, part.ExpiryDate)
                .input("Status", sql.VarChar, part.Status)
                .input("carID", sql.Int, carID)
                .input("partID", sql.Int, part.PartID)
                .query(query);
        } catch (error) {
            console.error(`Error updating car part with PartID ${part.PartID} for CarID ${carID}:`, error);
            throw error;
        }
    }
}

module.exports = UpdateCarPart;