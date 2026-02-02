const Case = require("../models/Case");
const Court = require("../models/Court");
const Judge = require("../models/Judge");
const SubjectMatter = require("../models/SubjectMatter");
const Department = require("../models/Department");
const Designation = require("../models/Designation");

// GET /api/summary/counts
exports.getSummaryCounts = async (req, res) => {
  try {
    const [
      totalCases,
      pending,
      closed,
      inProgress,
      upcoming,
      critical,
      tasks,
      courts,
      judges,
      subjectMatters,
      departments,
      designations,
    ] = await Promise.all([
      Case.countDocuments(),
      Case.countDocuments({ status: "Pending" }),
      Case.countDocuments({ status: "Closed" }),
      Case.countDocuments({ status: "In Progress" }),
      Case.countDocuments({ nextHearingDate: { $gte: new Date() } }),
      Case.countDocuments({ revenue: { $gte: 100 } }), // Example: revenue > 100M is critical
      Case.aggregate([{ $unwind: "$tasks" }, { $count: "count" }]).then(
        (arr) => arr[0]?.count || 0
      ),
      Court.countDocuments(),
      Judge.countDocuments(),
      SubjectMatter.countDocuments(),
      Department.countDocuments(),
      Designation.countDocuments(),
    ]);

    res.json({
      totalCases,
      pending,
      closed,
      inProgress,
      upcoming,
      critical,
      tasks,
      courts,
      judges,
      subjectMatters,
      departments,
      designations,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
