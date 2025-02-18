const getAccount = require("../../database/user/getAccount.js");

const checkAccount = async (req, res) => {
  const { accountType, account } = req.body;
  const userData = await getAccount(accountType, account);
  if (userData) {
    return res.status(404).json({ message: "Account not found" });
  } else {
    return res.status(200).json({ message: "Account found" });
  }
};

module.exports = checkAccount;
