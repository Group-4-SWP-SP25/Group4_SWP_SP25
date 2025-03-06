const sql = require("mssql");
const getPartInfoByID = require("../../database/partInfo/getPartInfoByID");

const partInfo = async (req, res) => {
  try {
    const { partID } = req.body;
    const part = await getPartInfoByID(partID);
    res.status(200).send(part);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = partInfo;
