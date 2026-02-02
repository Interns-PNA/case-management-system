const express = require("express");
const router = express.Router();
const Court = require("../models/Court");

// ➕ Add a new court with multiple locations
router.post('/', async (req, res) => {
  try {
    const { name, locations } = req.body;

    // ✅ Input validation
    if (!name || !locations || !Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({ error: "Court name and at least one location are required." });
    }

    const newCourt = new Court({ name, locations });
    const saved = await newCourt.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📄 Get all courts with populated locations
router.get("/", async (req, res) => {
  try {
    const courts = await Court.find().populate("locations");
    res.json(courts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔄 Update court by ID with new name or locations
router.put('/:id', async (req, res) => {
  try {
    const { name, locations } = req.body;

    // ✅ Input validation
    if (!name || !locations || !Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({ error: "Court name and at least one location are required." });
    }

    const updated = await Court.findByIdAndUpdate(
      req.params.id,
      { name, locations },
      { new: true }
    ).populate("locations"); // Optional: populate updated locations
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ Delete a court by ID
router.delete('/:id', async (req, res) => {
  try {
    await Court.findByIdAndDelete(req.params.id);
    res.json({ message: "Court deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
