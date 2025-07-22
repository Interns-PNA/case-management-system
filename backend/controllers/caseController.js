const Case = require("../models/Case");

// Create a new case
exports.createCase = async (req, res) => {
  try {
    const newCase = new Case(req.body);
    const saved = await newCase.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all cases
exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find().populate(
      "court judges subjectMatter location"
    );
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a case by ID
exports.getCaseById = async (req, res) => {
  try {
    const foundCase = await Case.findById(req.params.id).populate(
      "court judges subjectMatter location"
    );
    if (!foundCase) return res.status(404).json({ error: "Case not found" });
    res.json(foundCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a case by ID
exports.updateCase = async (req, res) => {
  try {
    const updated = await Case.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Case not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a case by ID
exports.deleteCase = async (req, res) => {
  try {
    const deleted = await Case.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Case not found" });
    res.json({ message: "Case deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
