const sql = require("mssql");

const getAccount = async (accountType, account) => {
  try {
    const pool = global.pool;
    const ps = new sql.PreparedStatement(pool);
    ps.input("account", sql.VarChar);
    let query = "SELECT * FROM [User] WHERE ";
    switch (accountType) {
      case "UserName":
        query += "UserName = @account";
        break;
      case "Email":
        query += "Email = @account";
        break;
      default:
        query += "Phone = @account";
    }
    await ps.prepare(query);

    const result = await ps.execute({ account });

    await ps.unprepare();

    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = getAccount;
