/*
 Seed script to populate the database with realistic dummy data.
 Safe to run multiple times: it will purge existing collections first.
*/
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Court = require("../models/Court");
const Location = require("../models/Location");
const Bench = require("../models/Bench");
const Judge = require("../models/Judge");
const Department = require("../models/Department");
const Designation = require("../models/Designation");
const Status = require("../models/Status");
const SubjectMatter = require("../models/SubjectMatter");
const Case = require("../models/Case");

async function connect() {
  if (!process.env.MongoURI) {
    console.error("MongoURI not set in environment");
    process.exit(1);
  }
  await mongoose.connect(process.env.MongoURI);
}

async function clearCollections() {
  const models = [
    User,
    Court,
    Location,
    Bench,
    Judge,
    Department,
    Designation,
    Status,
    SubjectMatter,
    Case,
  ];
  for (const m of models) {
    try {
      await m.deleteMany({});
    } catch (e) {
      console.warn("Skip deleting for", m.modelName, e.message);
    }
  }
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randDateWithin(daysBack = 180) {
  const now = Date.now();
  const past = now - randomInt(0, daysBack) * 24 * 3600 * 1000;
  return new Date(past);
}

async function seed() {
  await connect();
  console.log("Connected. Clearing existing data...");
  await clearCollections();

  // Locations
  const locationNames = [
    "Islamabad",
    "Karachi",
    "Lahore",
    "Peshawar",
    "Quetta",
    "Multan",
  ];
  const locations = await Location.insertMany(
    locationNames.map((name) => ({ name }))
  );

  // Courts
  const courtData = [
    { name: "Supreme Court of Pakistan" },
    { name: "Lahore High Court" },
    { name: "Sindh High Court" },
    { name: "Peshawar High Court" },
    { name: "Balochistan High Court" },
  ];
  const courts = await Court.insertMany(
    courtData.map((c) => ({
      ...c,
      locations: locations.filter(() => Math.random() > 0.4).map((l) => l._id),
    }))
  );

  // Benches (associate with random 1-2 courts)
  const benchNames = [
    "Civil Bench A",
    "Civil Bench B",
    "Criminal Bench A",
    "Criminal Bench B",
    "Tax Bench",
    "Service Bench",
  ];
  const benches = [];
  for (const bn of benchNames) {
    const assignedCourts = courts
      .filter(() => Math.random() > 0.5)
      .slice(0, 2)
      .map((c) => c._id);
    if (assignedCourts.length === 0)
      assignedCourts.push(randomChoice(courts)._id);
    benches.push({ name: bn, courts: assignedCourts });
  }
  const benchDocs = await Bench.insertMany(benches);

  // Judges
  const judgeNames = [
    "Justice A. Khan",
    "Justice B. Malik",
    "Justice C. Shah",
    "Justice D. Rizvi",
    "Justice E. Qureshi",
    "Justice F. Siddiqui",
    "Justice G. Chaudhry",
  ];
  const judges = await Judge.insertMany(
    judgeNames.map((n) => ({
      name: n,
      court: randomChoice(courts)._id,
      location: randomChoice(locations)._id,
    }))
  );

  // Departments
  const departmentData = [
    { name: "Legal Affairs", details: "Handles all legal proceedings." },
    { name: "Finance", details: "Financial oversight and budgeting." },
    { name: "Human Resources", details: "Staffing and personnel management." },
  ];
  const departments = await Department.insertMany(departmentData);

  // Designations
  const designationData = [
    { name: "Assistant Director Legal", department: departments[0]._id },
    { name: "Deputy Director Legal", department: departments[0]._id },
    { name: "Director Legal", department: departments[0]._id },
    { name: "Accounts Officer", department: departments[1]._id },
    { name: "Finance Manager", department: departments[1]._id },
    { name: "HR Officer", department: departments[2]._id },
  ];
  const designations = await Designation.insertMany(designationData);

  // Statuses
  const statusNames = [
    "Pending",
    "In Progress",
    "Disposed",
    "Adjourned",
    "Reserved for Order",
  ];
  const statuses = await Status.insertMany(
    statusNames.map((name) => ({ name }))
  );

  // Subject Matters
  const subjectMatterNames = [
    "Taxation",
    "Service Matters",
    "Criminal Appeal",
    "Civil Appeal",
    "Land Acquisition",
    "Contract Dispute",
    "Environmental",
  ];
  const subjectMatters = await SubjectMatter.insertMany(
    subjectMatterNames.map((name) => ({ name }))
  );

  // Users (with hashed passwords using model hook)
  const rawUsers = [
    {
      username: "admin",
      fullName: "System Administrator",
      password: "Admin@123",
      permission: "read-write",
    },
    {
      username: "legal.officer",
      fullName: "Legal Officer",
      password: "Legal@123",
      permission: "read-write",
    },
    {
      username: "viewer1",
      fullName: "Read Only User",
      password: "Viewer@123",
      permission: "read-only",
    },
  ];
  const users = [];
  for (const ru of rawUsers) {
    users.push(await User.create(ru));
  }

  // Cases
  const caseTypes = ["Civil", "Criminal", "Tax", "Service"];
  const ministries = [
    "Ministry of Finance",
    "Ministry of Interior",
    "Ministry of Education",
    "Ministry of Energy",
  ];
  const lawOfficers = ["Ali Raza", "Fatima Noor", "Usman Tariq", "Hina Qadir"];

  const casesToInsert = [];
  for (let i = 1; i <= 40; i++) {
    const subject = randomChoice(subjectMatters);
    const judgeSample = judges
      .filter(() => Math.random() > 0.5)
      .slice(0, randomInt(1, 3))
      .map((j) => j._id);
    if (judgeSample.length === 0) judgeSample.push(randomChoice(judges)._id);
    const hearingDate = randDateWithin(120);
    const nextHearingDate =
      Math.random() > 0.5
        ? new Date(hearingDate.getTime() + randomInt(10, 45) * 24 * 3600 * 1000)
        : null;

    casesToInsert.push({
      caseNo: `C-${2025}-${String(i).padStart(4, "0")}`,
      caseTitle: `State vs ${randomChoice([
        "Ahmad",
        "Khan",
        "Malik",
        "Shah",
        "Raza",
        "Iqbal",
      ])}`,
      caseType: randomChoice(caseTypes),
      ministry: randomChoice(ministries),
      fileNo: `F-${String(1000 + i)}`,
      revenue: randomInt(50000, 500000),
      status: randomChoice(statuses).name,
      court: randomChoice(courts)._id,
      location: randomChoice(locations)._id,
      bench: randomChoice(benchDocs).name,
      judges: judgeSample,
      totalJudges: judgeSample.length,
      subjectMatter: subject._id,
      initialRemarks:
        "Initial review completed. Awaiting further documentation.",
      hearingDate,
      nextHearingDate,
      files: [],
      focalPersonName: randomChoice([
        "Focal Ali",
        "Focal Sana",
        "Focal Bilal",
        "Focal Zara",
      ]),
      contact: "+92-3" + randomInt(100000000, 999999999),
      lawOfficer: randomChoice(lawOfficers),
      cmApplications:
        Math.random() > 0.6 ? ["CM-APP-" + randomInt(100, 999)] : [],
      tasks:
        Math.random() > 0.5
          ? ["Prepare brief", "Collect evidence"]
          : ["Draft reply"],
      caseRemarks: [
        { date: randDateWithin(150), remarks: "Case registered and indexed." },
        { date: randDateWithin(90), remarks: "Preliminary hearing conducted." },
      ],
    });
  }
  const cases = await Case.insertMany(casesToInsert);

  // Update subject matter case counts
  for (const sm of subjectMatters) {
    const count = cases.filter(
      (c) => c.subjectMatter.toString() === sm._id.toString()
    ).length;
    sm.cases = count;
    await sm.save();
  }

  console.log("Seeding completed successfully. Summary:");
  console.table({
    Users: users.length,
    Courts: courts.length,
    Locations: locations.length,
    Benches: benchDocs.length,
    Judges: judges.length,
    Departments: departments.length,
    Designations: designations.length,
    Statuses: statuses.length,
    SubjectMatters: subjectMatters.length,
    Cases: cases.length,
  });

  await mongoose.disconnect();
  console.log("Disconnected.");
}

seed().catch((err) => {
  console.error("Seed error", err);
  mongoose.disconnect();
});
