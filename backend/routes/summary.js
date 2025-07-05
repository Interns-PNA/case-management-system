const express = require("express");
const router = express.Router();
const Court = require("../models/Court");
const Judge = require("../models/Judge");
const SubjectMatter = require("../models/SubjectMatter");

// Get summary counts
router.get("/counts", async (req, res) => {
  try {
    const courtsCount = await Court.countDocuments();
    const judgesCount = await Judge.countDocuments();
    const subjectMattersCount = await SubjectMatter.countDocuments(); // ✅

    res.json({
      courts: courtsCount,
      judges: judgesCount,
      subjectMatters: subjectMattersCount, // ✅
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch counts" });
  }
});


module.exports = router;
