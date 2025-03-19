const sql = require('mssql');

const updateServiceByID = async (req, res) => {
    try {
        const pool = global.pool;
        const { serviceID, typeID, partID, name, description, price, estTime, image } = req.body;
        console.log(req.body);

        const query = ` UPDATE [Service] 
                        SET ServiceTypeID = @typeID, PartID = @partID, ServiceName = @name, ServiceDescription = @description, ServicePrice = @price, EstimatedTime = @estTime, ServiceImage = @image
                        WHERE ServiceID = @serviceID`;

        const result = await pool
            .request()
            .input('serviceID', sql.Int, serviceID)
            .input('typeID', sql.Int, typeID)
            .input('partID', sql.Int, partID)
            .input('name', sql.VarChar, name)
            .input('description', sql.Text, description)
            .input('price', sql.Float, price)
            .input('estTime', sql.Int, estTime)
            .input('image', sql.VarChar, image)
            .query(query);

        if (result.rowsAffected[0] === 0) {
            console.log(`Failed to update service with ID = ${serviceID}`);
            return { success: false }; // Return failure status
        }
        console.log(`Updated service with ID = ${serviceID}`);
        return { success: result.rowsAffected[0] > 0 }; // Return success status
    } catch (err) {
        console.error(`Error updating service with ID = ${serviceID}:`, err);
        return { success: false, error: err.message }; // Return error status
    }
};

module.exports = updateServiceByID;
