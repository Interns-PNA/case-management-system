const express = require("express");
const router = express.Router();
const summaryController = require("../controllers/summaryController");

router.get("/counts", summaryController.getSummaryCounts);

module.exports = router;
