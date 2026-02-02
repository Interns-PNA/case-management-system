const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const path = require("path");
const subjectMatterRoutes = require("./routes/subjectMatters");
const departmentRoutes = require("./routes/departmentRoutes");
const designationRoutes = require("./routes/designations");
const statusRoutes = require("./routes/statusRoutes");

const User = require("./models/User");
const app = express();
dotenv.config();

// Ensure admin user exists
async function ensureAdminUser() {
  try {
    const admin = await User.findOne({ username: "admin" });
    if (!admin) {
      const newAdmin = new User({
        username: "admin",
        password: "admin1",
        fullName: "Admin", // Required field
        permission: "read-write",
      });
      await newAdmin.save();
      console.log("Default admin user created: admin / admin1");
    } else {
      // Always reset admin password, permission, and fullName on server start
      admin.password = "admin1"; // Will be re-hashed by pre-save
      admin.permission = "read-write";
      admin.fullName = "Admin";
      await admin.save();
      console.log(
        "Admin user password, permission, and fullName reset to default"
      );
    }
  } catch (err) {
    console.error("Error ensuring admin user:", err);
  }
}

// Call ensureAdminUser only after DB is connected
connectDB().then(() => {
  ensureAdminUser();
});

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/api/users", require("./routes/userRoutes"));

// Add more routes as needed

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
