const getCarParts = require("../../database/car/getCarParts");

const getCarPartsApi = async (req, res) => {
    try {
        const { carID } = req.body;
        const carParts = await getCarParts(carID);
        res.status(200).json({ list: carParts });
    }
    catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
}

module.exports = getCarPartsApi;