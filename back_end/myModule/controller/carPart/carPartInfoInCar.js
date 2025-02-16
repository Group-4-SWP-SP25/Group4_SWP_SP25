const getCarPartByCar = require("../../database/carPart/getCarPartByCar");

const carPartInfoInCar = async (req, res) => {
  try {
    const { carID, partID } = req.body;
    const carPart = await getCarPartByCar(carID, partID);
    res.status(200).send(carPart);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = carPartInfoInCar;
