const express = require("express");
const router = express.Router();
const controller = require("../controllers/doctorSchedule.controller");

router.get("/doctor/:drID", controller.getAll);

router.delete("/schedule/:id", controller.deleteOne);

router.post("/", controller.createOne);

router.put("/", controller.updateOne);
module.exports = router;
