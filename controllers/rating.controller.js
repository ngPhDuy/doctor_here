const ratingService = require("../services/rating.service");

exports.getAllRatingsByDoctorID = async (req, res) => {
  try {
    const drID = req.params.drID;
    const ratings = await ratingService.getAllRatingsByDoctorID(drID);
    res.status(200).send(ratings);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createRating = async (req, res) => {
  try {
    console.log(req.body);
    const rating = await ratingService.createRating(req.body);
    res.status(200).send(rating);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
