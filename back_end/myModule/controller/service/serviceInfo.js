const getServiceByID = require("../../database/service/getServiceByID.js");

const serviceInfo = async (req, res) => {
  try {
    const { serviceID } = req.body;
    const service = await getServiceByID(serviceID);
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = serviceInfo;
