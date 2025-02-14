const { UserList, TotalUserCount } = require("../database/user/UserList");

const getUserList = async (req, res) => {
    const { firstIndex, count, searchString, sortColumn, sortOrder } = req.body;
    const userData = await UserList(firstIndex, count, searchString, sortColumn, sortOrder);
    res.status(200).json({ list: userData });
}

const getTotalUserCount = async (req, res) => {
    const { searchString } = req.body;
    const totalUserCount = await TotalUserCount(searchString);
    res.status(200).json({ count: totalUserCount });
}

module.exports = {
    getUserList,
    getTotalUserCount
}