const getCarByID = require("../../database/car/getCarByID.js");
const carInfo = async (req, res) => {
  try {
    const { carID } = req.body;
    const car = await getCarByID(carID);
    res.status(200).json(car);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = carInfo;
