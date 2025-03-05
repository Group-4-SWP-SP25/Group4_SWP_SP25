const getPartBySystem = require("../../database/partInfo/getPartBySystem.js");

const listPartBySystem = async (req, res) => {
  try {
    const { carSystemID } = req.body;
    const partList = await getPartBySystem(carSystemID);
    res.status(200).send(partList);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = listPartBySystem;
