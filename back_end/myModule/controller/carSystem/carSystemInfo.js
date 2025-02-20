const getCarSystemByID = require("../../database/carSystem/getCarSystemByID.js");

const carSystemInfo = async (req, res) => {
  try {
    const { carSystemID } = req.body;
    const carSystem = await getCarSystemByID(carSystemID);
    res.status(200).send(carSystem);
  } catch (err) {
    throw err;
  }
};

module.exports = carSystemInfo;
