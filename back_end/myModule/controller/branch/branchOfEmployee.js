const getBranchOfEmployee = require("../../database/branch/getBranchOfEmployee");

const branchOfEmployee = async (req, res) => {
  try {
    const { employeeID } = req.body;
    const branch = await getBranchOfEmployee(employeeID);
    res.status(200).send(branch);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = branchOfEmployee;
