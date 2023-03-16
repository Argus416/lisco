const express = require("express");
const router = express.Router();
const csvReaderController = require("../controllers/csvReaderController");

router.post("/analyse", csvReaderController.csvAnalyser);

module.exports = router;
