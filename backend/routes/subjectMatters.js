const express = require("express");
const router = express.Router();
const SubjectMatter = require("../models/SubjectMatter");

// ➕ Add subject matter
router.post("/", async (req, res) => {
  try {
    const { name, cases } = req.body;
    const newSubject = new SubjectMatter({ name, cases });
    const saved = await newSubject.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📄 Get all subject matters
router.get("/", async (req, res) => {
  try {
    const subjects = await SubjectMatter.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update subject matter
router.put("/:id", async (req, res) => {
  try {
    const { name, cases } = req.body;
    const updated = await SubjectMatter.findByIdAndUpdate(
      req.params.id,
      { name, cases },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ Delete subject matter
router.delete("/:id", async (req, res) => {
  try {
    await SubjectMatter.findByIdAndDelete(req.params.id);
    res.json({ message: "Subject Matter deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
