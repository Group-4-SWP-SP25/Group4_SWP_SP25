const getAllCarPart = require("../../database/carPart/getAllCarPart.js");

const listCarPart = async (req, res) => {
  try {
    const carID = req.body;
    const carPartList = await getAllCarPart(carID);
    res.status(200).send(carPartList);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = listCarPart;
