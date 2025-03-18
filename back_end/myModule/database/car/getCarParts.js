const sql = require("mssql");

const getCarParts = async (carID) => {
    try {
        const pool = global.pool;
        const query = `
          SELECT * FROM [CarPart] WHERE CarID = @carID
        `;

        const result = await pool
            .request()
            .input("carID", sql.Int, carID)
            .query(query);
        return result.recordset;
    } catch (err) {
        console.error("Error", err);
        return null;
    }
};

module.exports = getCarParts;