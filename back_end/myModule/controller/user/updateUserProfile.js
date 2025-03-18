const connect = require("../../database/connectDB");
const sql = require("mssql");

const updateUserProfile = async (req, res) => {
  try {
    const pool = global.pool;
    const { id, first_name, last_name, email, address, phone, dob = null } = req.body;
    if (!id || !first_name || !last_name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const query = `
      UPDATE [User] 
      SET FirstName = @first_name, 
          LastName = @last_name, 
          Email = @email, 
          Address = @address, 
          Phone = @phone,
          DOB = @dob 
      WHERE UserID = @id
    `;

    await pool
      .request()
      .input("id", sql.Int, id)
      .input("first_name", sql.VarChar, first_name)
      .input("last_name", sql.VarChar, last_name)
      .input("email", sql.VarChar, email)
      .input("address", sql.VarChar, address)
      .input("phone", sql.VarChar, phone)
      .input("dob", sql.DateTime, dob)
      .query(query);


    res.status(200).json({ message: "User profile updated successfully" });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = updateUserProfile;
