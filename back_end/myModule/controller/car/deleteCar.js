const deleteCar = require("../../database/car/deleteCar.js");

const deleteCarApi = async (req, res) => {
    const { carID } = req.body;
    try {
        await deleteCar(carID);
        res.status(200).send({ message: "Car deleted" });
    } catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
}

module.exports = deleteCarApi;