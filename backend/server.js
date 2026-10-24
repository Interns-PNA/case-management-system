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

// Create the initial admin user only if it does not exist yet.
// Never resets an existing admin password on startup.
async function ensureAdminUser() {
  try {
    const admin = await User.findOne({ username: "admin" });
    if (admin) {
      return;
    }
    const password = process.env.ADMIN_INITIAL_PASSWORD || "admin1";
    const newAdmin = new User({
      username: "admin",
      password,
      fullName: "Admin", // Required field
      permission: "read-write",
    });
    await newAdmin.save();
    console.log("Default admin user created (username: admin)");
  } catch (err) {
    console.error("Error ensuring admin user:", err);
  }
}

const { seed } = require("./scripts/seed");

// Call ensureAdminUser only after DB is connected
connectDB().then(async () => {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log("Empty database detected — seeding demo data...");
    try {
      await seed({ disconnect: false });
      console.log("Demo data seeded.");
    } catch (err) {
      console.error("Seeding failed:", err);
    }
  }
  ensureAdminUser();
});

// CORS: restrict to an allowlist when ALLOWED_ORIGINS is set,
// otherwise allow all origins (convenient for local development).
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors(
    allowedOrigins.length > 0
      ? { origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`Origin ${origin} not allowed by CORS`));
          }
        } }
      : undefined
  )
);
app.use(express.json());

// Health endpoint (used by Container Apps probes and CI smoke tests)
app.get("/health", (req, res) => {
  const dbUp = mongoose.connection.readyState === 1;
  res.status(dbUp ? 200 : 503).json({
    status: dbUp ? "ok" : "degraded",
    db: dbUp ? "up" : "down",
  });
});

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
