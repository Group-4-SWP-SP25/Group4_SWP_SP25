const getCarByUserID = require("../../database/car/getCarByUserID.js");

const carList = async (req, res) => {
  try {
    const { userID } = req.body;
    const cars = await getCarByUserID(userID);

    res.status(200).send(cars);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = carList;
