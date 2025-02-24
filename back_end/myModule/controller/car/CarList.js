const getCarByUserID = require("../../database/car/getCarByUserID.js");

const carInfo = async (req, res) => {
  try {
    const { userID } = req.body; 
    if (!userID) {
      return res.status(400).json({ message: "UserID is required" });
    }

    const cars = await getCarByUserID(userID);

    if (!cars || cars.length === 0) {
      return res.status(404).json({ message: "No cars found for this user" });
    }

    res.status(200).json(cars);
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = carInfo;
