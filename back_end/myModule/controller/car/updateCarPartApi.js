const e = require('express');
const UpdateCarPart = require('../../database/car/updateCarParts')

const UpdateCarPartApi = async (req, res) => {
    const { carID, parts } = req.body;
    try {
        await UpdateCarPart(carID, parts);
        res.status(200).send('Update Car part successfully')
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Internal Server Error" });
    }
}

module.exports = UpdateCarPartApi