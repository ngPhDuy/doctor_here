const express = require("express");
const router = express.Router();
const relativeController = require("../controllers/relative.controller");

router.post("/", relativeController.createRelative);

router.get("/", relativeController.getAllRelatives);

module.exports = router;
