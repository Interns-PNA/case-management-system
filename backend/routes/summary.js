const express = require("express");
const router = express.Router();
const Court = require("../models/Court");
const Judge = require("../models/Judge");
const SubjectMatter = require("../models/SubjectMatter");
const Case = require("../models/Case");
const Department = require("../models/Department");
const Designation = require("../models/Designation");

// Get summary counts
router.get("/counts", async (req, res) => {
  try {
    const courtsCount = await Court.countDocuments();
    const judgesCount = await Judge.countDocuments();
    const subjectMattersCount = await SubjectMatter.countDocuments();

    // Count cases by status
    const totalCases = await Case.countDocuments();
    const pendingCases = await Case.countDocuments({ status: "Pending" });
    const closedCases = await Case.countDocuments({ status: "Closed" });
    const inProgressCases = await Case.countDocuments({
      status: "In Progress",
    });
    const upcomingCases = await Case.countDocuments({ status: "Upcoming" });
    const criticalCases = await Case.countDocuments({ status: "Critical" });

    // Count other entities
    const departmentsCount = await Department.countDocuments();
    const designationsCount = await Designation.countDocuments();

    res.json({
      courts: courtsCount,
      judges: judgesCount,
      subjectMatters: subjectMattersCount,
      totalCases: totalCases,
      pending: pendingCases,
      closed: closedCases,
      inProgress: inProgressCases,
      upcoming: upcomingCases,
      critical: criticalCases,
      tasks: 0, // placeholder for tasks
      departments: departmentsCount,
      designations: designationsCount,
    });
  } catch (err) {
    console.error("Error fetching summary counts:", err);
    res.status(500).json({ error: "Failed to fetch counts" });
  }
});

module.exports = router;
