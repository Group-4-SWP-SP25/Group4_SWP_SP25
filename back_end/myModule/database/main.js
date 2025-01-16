const changePassword = require("./user.js");

async function run() {
  const userId = 1; // Example user ID (you can replace with dynamic input)
  const newPassword = "new_secure_password"; // Example new password

  try {
    const result = await changePassword(userId, newPassword);
    console.log("Password change result:", result);
  } catch (err) {
    console.error("Failed to change password:", err.message);
  }
}

run();
