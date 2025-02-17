const ratingService = require('../services/rating.service');

exports.getAllRatingsByDoctorID = async (req, res) => {
    try {
        const doctorID = req.query.doctorID;
        const ratings = await ratingService.getAllRatingsByDoctorID(doctorID);
        res.status(200).send(ratings);
    } catch (error) {
        res.status(500).send(error.message);
    }
}