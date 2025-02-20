const serviceListByPartID = require("../../database/service/serviceListByPartID.js");

const listServicePerPart = async (req, res) => {
  const { partID } = req.body;
  const listService = await serviceListByPartID(partID);
  res.status(200).send(listService);
};

module.exports = listServicePerPart;
