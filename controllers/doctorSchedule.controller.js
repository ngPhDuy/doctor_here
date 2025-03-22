const service = require("../services/doctorSchedule.service");

exports.createOne = async (req, res) => {
  try {
    const doctorSchedule = await service.createOne(req.body);
    res.status(200).json(doctorSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const doctorSchedule = await service.deleteOne(req.params.id);
    res.status(200).json(doctorSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const doctorSchedule = await service.updateOne(req.body);
    res.status(200).json(doctorSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const schedules = await service.getAll(req.params.drID);
    res.status(200).json(schedules);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
