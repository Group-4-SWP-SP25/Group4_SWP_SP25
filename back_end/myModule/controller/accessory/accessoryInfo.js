const getAccessoryInfoByServiceID = require("../../database/accessoryInfo/getAccessoryInfoByServiceID");

const accessoryInfo = async (req, res) => {
  try {
    const { serviceID } = req.body;
    const accessory = await getAccessoryInfoByServiceID(serviceID);
    res.status(200).send(accessory);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = accessoryInfo;
