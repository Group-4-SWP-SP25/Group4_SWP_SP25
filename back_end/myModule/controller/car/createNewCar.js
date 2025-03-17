const createNewCar = require("../../database/car/createNewCar.js");

const createNewCarApi = async (req, res) => {
    try {
        const userID = req.body.userID;
        const result = await createNewCar(userID);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }

};

module.exports = createNewCarApi;