const sql = require('mssql');
const getCarByID = async (carID) => {
    try {
        const pool = global.pool;
        const query = `
            SELECT * FROM [Car] 
            WHERE CarID = @carID`;
        
        const result = await pool.request().input('carID', sql.Int, carID).query(query);

        const carData = result.recordset[0];
        return carData;
    } catch (err) {
        console.log('Error', err);
    }
};

module.exports = getCarByID;



