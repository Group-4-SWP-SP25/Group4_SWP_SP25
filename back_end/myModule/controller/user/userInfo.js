const getUserProfile = require("../../database/user/getUserProfile.js"); 

const userInfo= async (req, res) => {
    try {
        const {userID}= req.body;
        const user = await getUserProfile(userID);
       res.status(200).send(user);
    } catch (error) {
        
        res.status(500).send({ error: "Interval Server Error!" });
    }
};
module.exports = userInfo;