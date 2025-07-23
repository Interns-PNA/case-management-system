const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const subjectMatterRoutes = require("./routes/subjectMatters");
const departmentRoutes = require("./routes/departmentRoutes");
const designationRoutes = require("./routes/designations");
const statusRoutes = require("./routes/statusRoutes");

const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

// Routes

app.use("/api/cases", require("./routes/caseRoutes"));
app.use("/api/courts", require("./routes/courtRoutes"));
app.use("/api/locations", require("./routes/locationRoutes"));
app.use("/api/judges", require("./routes/judgeRoutes"));
app.use("/api/benches", require("./routes/benchRoutes"));
app.use("/api/summary", require("./routes/summaryRoutes"));
app.use("/api/subject-matter", subjectMatterRoutes); // path must match frontend
app.use("/api/departments", departmentRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/statuses", statusRoutes);

// Add more routes as needed

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
