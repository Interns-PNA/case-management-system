const express = require("express");
const router = express.Router();
const Designation = require("../models/Designation");

// GET all designations (with department name populated)
router.get("/", async (req, res) => {
  try {
    const designations = await Designation.find().populate("department", "name");
    res.json(designations);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});

// POST a new designation
router.post("/", async (req, res) => {
  const { name, details, department } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const newDesignation = new Designation({ name, details, department });
    await newDesignation.save();
    res.status(201).json(newDesignation);
  } catch (err) {
    res.status(500).json({ message: "Failed to create designation", error: err });
  }
});

// PUT - update a designation
router.put("/:id", async (req, res) => {
  const { name, details, department } = req.body;

  try {
    const updated = await Designation.findByIdAndUpdate(
      req.params.id,
      { name, details, department },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update", error: err });
  }
});

// DELETE - remove a designation
router.delete("/:id", async (req, res) => {
  try {
    await Designation.findByIdAndDelete(req.params.id);
    res.json({ message: "Designation deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete", error: err });
  }
});

module.exports = router;
