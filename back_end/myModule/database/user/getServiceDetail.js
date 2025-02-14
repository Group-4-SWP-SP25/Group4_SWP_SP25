const connect = require('../connectDB.js');
const sql = require('mssql');
// const Service = require('../../model/service.js');

const getServiceDetailByID = async (serviceID) => {
    try {
        const pool = global.pool;
        const query = `SELECT * FROM Services WHERE ServiceID = @serviceID`;
        const result = await pool.request().input('serviceID', sql.Int, serviceID).query(query);
        const serviceData = result.recordset[0];

        return serviceData;
    } catch (err) {
        throw err;
    }
}

module.exports = getServiceDetailByID;
