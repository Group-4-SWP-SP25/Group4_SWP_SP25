const sql = require('mssql');

const addUser = async (user) => {
    try {
        const pool = global.pool; // Get the connection pool
        const query = `
                    INSERT INTO [User](UserName, Password, FirstName, LastName, Email, Address, Phone, DOB)
                    VALUES (@userName, @password, @firstName, @lastName, @email, @address, @phone, @dob);
                    `;
        // Example query
        const result = await pool
            .request()
            .input('userName', sql.VarChar, user.username)
            .input('password', sql.VarChar, user.password)
            .input('firstName', sql.VarChar, user.firstName)
            .input('lastName', sql.VarChar, user.lastName)
            .input('email', sql.VarChar, user.email)
            .input('address', sql.VarChar, user.address)
            .input('phone', sql.VarChar, user.phone)
            .input('dob', sql.VarChar, user.dob)
            .query(query);

        return 1; // Optionally return the result
        // Close the connection (optional because `mssql` handles pooling)
    } catch (err) {
        console.error('Error add user:', err.message);
        return -1; // Optionally re-throw the error
    }
};

const addEmployee = async (user) => {
    try {
        const pool = global.pool; // Get the connection pool
        const query = `
                    INSERT INTO [User](UserName, Password, FirstName, LastName, Email, Address, Phone, DOB, Role)
                    VALUES (@userName, @password, @firstName, @lastName, @email, @address, @phone, @dob, 'Employee');
                    SELECT SCOPE_IDENTITY() AS LastInsertedID;
                    `;
        // Example query
        const result = await pool
            .request()
            .input('userName', sql.VarChar, user.username)
            .input('password', sql.VarChar, user.password)
            .input('firstName', sql.VarChar, user.firstName)
            .input('lastName', sql.VarChar, user.lastName)
            .input('email', sql.VarChar, user.email)
            .input('address', sql.VarChar, user.address)
            .input('phone', sql.VarChar, user.phone)
            .input('dob', sql.VarChar, user.dob)
            .query(query);

        const query2 = `
                    INSERT INTO [Employee](EmployeeID, BranchID)
                    VALUES (@employeeID, @branchID);
                    `;
        // Example query
        const result2 = await pool
            .request()
            .input('employeeID', sql.Int, result.recordset[0].LastInsertedID)
            .input('branchID', sql.Int, user.branchID)
            .query(query2);

        return 1; // Optionally return the result
        // Close the connection (optional because `mssql` handles pooling)
    } catch (err) {
        console.error('Error add user:', err.message);
        return -1; // Optionally re-throw the error
    }
};

module.exports = { addUser, addEmployee };
