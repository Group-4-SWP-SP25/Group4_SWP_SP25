const getUserList = require("./getUsetList");

async function run() {
  const firstIndex = 1;
  const lastIndex = 10;

  try {
    const result = await getUserList(firstIndex, lastIndex);
    console.log(result);
  } catch (err) {
    throw err;
  }
}

run();
