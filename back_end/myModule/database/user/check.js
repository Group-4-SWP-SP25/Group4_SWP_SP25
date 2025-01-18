const addUser = require("./addUser.js");

async function run() {
  const userId = 1; // Example user ID (you can replace with dynamic input)
  const password = "doanhieu"; // Example new password

  try {
    const result = await addUser(data);
    console.log(result);
  } catch (err) {
    throw err;
  }
}

run();
