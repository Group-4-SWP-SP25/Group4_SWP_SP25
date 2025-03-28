const getCarPartList = require("../../database/carPart/getCarPartList");

const carPartList = async (req, res) => {
  try {
    const { carID } = req.body;
    const carPartList = await getCarPartList(carID);
    res.status(200).send(carPartList);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = carPartList;
