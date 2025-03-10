const mssql = require('mssql');

const addService = async (req, res) => {
    try {
        const pool = global.pool;
        const { typeID, partID, name, description, price } = req.body;
        console.log(req.body);

        const query = `
                    INSERT INTO [Service] (ServiceTypeID, PartID, ServiceName, ServiceDescription, ServicePrice)
                    VALUES (@typeID, @partID, @name, @description, @price);`;

        const result = await pool
            .request()
            .input('typeID', mssql.Int, typeID)
            .input('partID', mssql.Int, partID)
            .input('name', mssql.VarChar, name)
            .input('description', mssql.Text, description)
            .input('price', mssql.Float, price)
            .query(query);

        if (result.rowsAffected[0] === 0) {
            console.log('Failed to add service');
            return { success: false }; // Return failure status
        }
        console.log('Added service');
        return { success: result.rowsAffected[0] > 0 }; // Return success status
    } catch (err) {
        console.error('Error adding service:', err);
        return { success: false, error: err.message }; // Return error status
    }   
}

module.exports = addService;