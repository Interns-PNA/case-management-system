const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  caseNo: { type: String, required: true },
  caseTitle: String,
  caseType: String,
  ministry: String,
  fileNo: String,
  revenue: Number,
  status: String,
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
  bench: String,
  judges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Judge' }],
  totalJudges: Number,
  subjectMatter: { type: mongoose.Schema.Types.ObjectId, ref: 'SubjectMatter' },
  initialRemarks: String,
  hearingDate: Date,
  nextHearingDate: Date,
  files: [String], // Store file names or URLs
  focalPersonName: String,
  contact: String,
  lawOfficer: String,
  cmApplications: [String],
  tasks: [String]
});

module.exports = mongoose.model("Case", caseSchema);
