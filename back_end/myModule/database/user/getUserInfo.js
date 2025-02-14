const findUserById = require('./findUserById.js')

const GetUserInfo = async (req, res) => {
  const userData = await findUserById(req.user.id);
  res.json({
    name: userData.FirstName,
    role: userData.Role,
    account: userData.UserName
  })

};

const GetUserInfo_Admin = async (req, res) => {
  const userData = await findUserById(req.body.id);
  res.json({
    FirstName: userData.FirstName,
    LastName: userData.LastName,
    Email: userData.Email,
    Phone: userData.Phone,
    Role: userData.Role,
    Address: userData.Address,
    DateCreated: userData.DateCreated,
    DOB: userData.DOB
  })
}

module.exports = {
  GetUserInfo,
  GetUserInfo_Admin
};
