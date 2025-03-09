const sql = require('mssql');

const updateServiceByID = async (req, res) => {
    try {
        const pool = global.pool;
        const { serviceID, typeID, partID, name, description, price } = req.body;
        // console.log(req.body);

        const query = `
            UPDATE [Service] 
            SET ServiceTypeID = @typeID, PartID = @partID, ServiceName = @name, ServiceDescription = @description, ServicePrice = @price 
            WHERE ServiceID = @serviceID`;

        const result = await pool
            .request()
            .input('serviceID', sql.Int, serviceID)
            .input('typeID', sql.Int, typeID)
            .input('partID', sql.Int, partID)
            .input('name', sql.VarChar, name)
            .input('description', sql.Text, description)
            .input('price', sql.Float, price)
            .query(query);

        console.log(result);
        if (result.rowsAffected[0] === 0) {
            console.log(`Failed to update service with ID = ${serviceID}`);
            return { success: false }; // Return failure status
        }
        console.log(`Updated service with ID = ${serviceID}`);
        return { success: result.rowsAffected[0] > 0 }; // Return success status
    } catch (err) {
        throw err;
    }
};

module.exports = updateServiceByID;
