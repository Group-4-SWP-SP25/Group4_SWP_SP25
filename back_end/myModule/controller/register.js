const addUser = require("../database/user/addUser.js");

const register = async (req, res) => {
  try {
    // Add user
    await addUser(req.body);
    res.status(200).send({ message: "Register successfully" });
  } catch {}
};

module.exports = register;
