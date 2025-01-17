const CheckAccountExist = require("./checkAccExist.js");

async function run() {
  const userId = 1; // Example user ID (you can replace with dynamic input)
  const password = "doanhieu"; // Example new password

  try {
    data = {
      userId: userId,
      password: password,
    };
    const result = await CheckAccountExist(data);
    console.log("userinfo result:", result);
  } catch (err) {
    console.error("Failed to change password:", err.message);
  }
}

run();
