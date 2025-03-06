const getBranchByID = require("../../database/branch/getBranchByID");

const branchInfo = async (req, res) => {
  try {
    const { branchID } = req.body;
    const branch = await getBranchByID(branchID);
    res.status(200).send(branch);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = branchInfo;
