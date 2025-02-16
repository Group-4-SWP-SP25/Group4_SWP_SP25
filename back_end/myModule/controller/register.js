const addUser = require("../database/user/addUser.js");

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, username, password } =
      req.body;

    // Add user
    await addUser(req.body);
    res.status(200).send({ message: "Register successfully" });
  } catch {}
};

module.exports = register;
