const mssql = require("mssql");

async function getEmployees(req, res) {
    try {
        const pool = global.pool;

        const query = `
            SELECT UserID, FirstName, LastName, Email, Phone
            FROM [User]
            WHERE Role = 'Employee'
        `;

        const result = await pool.request().query(query);
        res.status(200).json({ employees: result.recordset });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { getEmployees };