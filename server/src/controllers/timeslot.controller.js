const service = require("../services/timeslot.service.js");

exports.getTimeslots = async (req, res) => {
  try {
    const { drID, isOnlMethod, startTime, endTime } = req.query;
    const timeslots = await service.getTimeslots(
      drID,
      isOnlMethod,
      startTime,
      endTime
    );
    res.status(200).json(timeslots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
