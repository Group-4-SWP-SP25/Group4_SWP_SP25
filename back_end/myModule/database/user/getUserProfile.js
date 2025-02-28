const sql = require("mssql");

const getUserProfile = async (userID) => {
    try {
        const pool = global.pool;
        const result = await pool.request()
            .input("userID", sql.Int, userID)
            .query(`
                SELECT * 
                FROM [User] 
                WHERE UserID = @userID
            `);
                return result.recordset[0];
       
    } catch (err) {
      throw err;
     }

};

module.exports = getUserProfile;