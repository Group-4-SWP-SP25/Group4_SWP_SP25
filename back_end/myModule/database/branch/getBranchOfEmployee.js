const sql = require("mssql");

const getBranchOfEmployee = async (employeeID) => {
  try {
    const pool = global.pool;
    const query = `SELECT * FROM Branch WHERE BranchID IN (SELECT BranchID FROM Employee WHERE EmployeeID = @employeeID)`;
    const result = await pool
      .request()
      .input("employeeID", sql.Int, employeeID)
      .query(query);
    return result.recordset[0];
  } catch (err) {
    console.log(err);
  }
};

module.exports = getBranchOfEmployee;
