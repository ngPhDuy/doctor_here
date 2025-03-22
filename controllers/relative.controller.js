const relativeService = require("../services/relative.service");

exports.createRelative = async (req, res) => {
  try {
    const { patientID1, patientID2, relationship } = req.body;

    const result = await relativeService.createRelative(
      patientID1,
      patientID2,
      relationship
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllRelatives = async (req, res) => {
  try {
    const { patientID } = req.query;
    const result = await relativeService.getAllRelatives(patientID);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
