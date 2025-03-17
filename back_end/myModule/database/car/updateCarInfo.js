const sql = require("mssql");

const updateCarInfo = async (carID, carName, brand, regNum, year) => {
    try {
        const pool = global.pool;
        const query = `
        UPDATE Car
            SET 
                CarName = @carName, 
                Brand = @brand, 
                RegistrationNumber = @regNum, 
                [Year] = @year
            WHERE CarID = @carID;
        `;

        const result = await pool
            .request()
            .input("carID", sql.Int, carID)
            .input("carName", sql.VarChar, carName)
            .input("brand", sql.VarChar, brand)
            .input("regNum", sql.VarChar, regNum)
            .input("year", sql.Int, year)
            .query(query);
    } catch (err) {
        console.error("Error", err);
        return null;
    }
};

module.exports = updateCarInfo;