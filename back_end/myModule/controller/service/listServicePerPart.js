const getServiceListByPartID = require('../../database/service/getServiceListByPartID.js');

const listServicePerPart = async (req, res) => {
    const { partID } = req.body;
    const listService = await getServiceListByPartID(partID);
    res.status(200).send(listService);
};

module.exports = listServicePerPart;
