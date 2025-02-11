
// const User = require("../../model/user.js");
const findUserById = require('./findUserById.js')

const GetUserInfo = async (req, res) => {
  const userData = await findUserById(req.user.id);
  res.json({ name: userData.FirstName, role: userData.Role, account: userData.UserName })
};

module.exports = GetUserInfo;
