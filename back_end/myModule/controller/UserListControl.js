const { UserList, TotalUserCount } = require("../database/user/UserList");
const User = require("../model/user");

const getUserList = async (req, res) => {
    const { firstIndex, lastIndex } = req.body;
    const userData = await UserList(firstIndex, lastIndex);
    res.status(200).json({ list: userData })
}

const getTotalUserCount = async (req, res) => {
    const totalUserCount = await TotalUserCount()
    res.status(200).json({ count: totalUserCount });
}

module.exports = {
    getUserList,
    getTotalUserCount
}