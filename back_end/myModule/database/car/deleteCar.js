const sql = require('mssql');

const deleteCar = async (carID) => {
    try {
        const pool = global.pool;
        await pool.request()
            .input('carID', sql.Int, carID)
            .query('delete from Car where CarID = @carID');
    } catch (err) {
        console.error('Error deleting car:', err);
        throw err;
    }
}

module.exports = deleteCar;