const checkUserName = require("../../database/user/checkUserName");

const checkAccount = async (req, res) => {
  const { account } = req.body;
  const userData = await checkUserName(account);
  if (userData) {
    return res.status(404).json({ message: "Account not found" });
  } else {
    return res.status(200).json({ message: "Account found" });
  }
};

module.exports = checkAccount;
