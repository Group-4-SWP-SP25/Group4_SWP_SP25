const mssql = require("mssql");

async function getEmployees(req, res) {
    try {
        const { branchID } = req.body;
        const pool = global.pool;

        const query = `
            SELECT UserID, FirstName, LastName, Email, Phone
            FROM [User]
            inner join [Employee] 
            on [User].UserID = Employee.EmployeeID
            WHERE Role = 'Employee' and BranchID = @branchID
        `;

        const result = await pool
            .request()
            .input("branchID", mssql.Int, branchID)
            .query(query);
        res.status(200).json({ employees: result.recordset });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { getEmployees };