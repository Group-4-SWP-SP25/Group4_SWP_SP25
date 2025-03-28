const { addUser, addEmployee } = require("../database/user/addUser.js");

const register = async (req, res) => {
  try {
    // Add user
    await addUser(req.body);
    res.status(200).send({ message: "Register successfully" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

const registerEmployee = async (req, res) => {
  try {
    // Add user
    await addEmployee(req.body);
    res.status(200).send({ message: "Register successfully" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, registerEmployee };
