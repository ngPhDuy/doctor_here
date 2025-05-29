const relativeService = require("../services/relative.service");

exports.createRelative = async (req, res) => {
  try {
    const { ptID, phone, relationship } = req.body;

    const result = await relativeService.createRelative(
      ptID,
      phone,
      relationship
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllRelatives = async (req, res) => {
  try {
    const { ptID } = req.params;
    const result = await relativeService.getAllRelatives(ptID);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.changeRoleRelative = async (req, res) => {
  try {
    const { ptID1, ptID2, newRelationship } = req.body;
    const result = await relativeService.changeRoleRelative(
      ptID1,
      ptID2,
      newRelationship
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.confirmRelative = async (req, res) => {
  try {
    const { ptID1, ptID2 } = req.body;
    const result = await relativeService.confirmRelative(ptID1, ptID2);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getPendingRelatives = async (req, res) => {
  try {
    const { ptID } = req.params;
    const result = await relativeService.getPendingRelatives(ptID);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteRelative = async (req, res) => {
  try {
    const { ptID1, ptID2 } = req.body;
    const result = await relativeService.deleteRelative(ptID1, ptID2);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
