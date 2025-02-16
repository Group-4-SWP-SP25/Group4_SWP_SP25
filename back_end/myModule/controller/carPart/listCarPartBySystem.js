const getCarPartBySystem = require("../../database/carPart/getCarPartBySystem.js");

const listCarPartBySystem = async (req, res) => {
  try {
    const { carID, carSystemID } = req.body;
    const carPartList = await getCarPartBySystem(carID, carSystemID);
    res.status(200).send(carPartList);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = listCarPartBySystem;
