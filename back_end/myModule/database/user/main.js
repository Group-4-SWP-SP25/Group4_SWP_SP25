const CheckAccountExist = require("./checkAccExist.js");

async function run() {
  const userId = 1; // Example user ID (you can replace with dynamic input)
  const password = "new_secure_password"; // Example new password

  try {
    data = {
      userId: userId,
      password: password,
    };
    const result = await CheckAccountExist(userId, password);
    console.log("Password change result:", result);
  } catch (err) {
    console.error("Failed to change password:", err.message);
  }
}

run();
