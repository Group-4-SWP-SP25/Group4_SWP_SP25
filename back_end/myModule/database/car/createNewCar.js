const sql = require("mssql");

const createNewCar = async (userID) => {
    try {
        const pool = global.pool;
        const query = `
        INSERT INTO Car (UserID)
        VALUES (@userID);
        `;

        await pool
            .request()
            .input("userID", sql.Int, userID)
            .query(query);
    } catch (err) {
        console.error("Error", err);
        return null;
    }
};

module.exports = createNewCar;