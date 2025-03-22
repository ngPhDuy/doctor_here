const express = require('express');
const router = express.Router();
const firebaseController = require('../controllers/firebase.controller');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.post('/upload', upload, firebaseController.uploadFile);

module.exports = router;