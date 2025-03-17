const updateCarInfo = require("../../database/car/updateCarInfo");

const updateCarInfoApi = async (req, res) => {
    const { carID, carName, brand, regNum, year } = req.body;
    try {
        await updateCarInfo(carID, carName, brand, regNum, year);
        res.status(200).send({ message: "Car info updated" });
    } catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

module.exports = updateCarInfoApi;