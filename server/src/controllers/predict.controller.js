const service = require("../services/predict.service");

exports.predictDiabetes = async (req, res) => {
  try {
    const { ptID } = req.params;
    const data = await service.predictDiabetes(ptID, req.body);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error predicting diabetes:", error);
    res.status(500).json({ error: error.message });
  }
};
