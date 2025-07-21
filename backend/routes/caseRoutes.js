const express = require("express");
const router = express.Router();
const Case = require("../models/Case");

router.post("/", async (req, res) => {
  try {
    const newCase = new Case(req.body);
    const saved = await newCase.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const cases = await Case.find().populate("court judges subjectMatter");
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const foundCase = await Case.findById(req.params.id).populate(
      "court judges subjectMatter"
    );
    if (!foundCase) return res.status(404).json({ error: "Case not found" });
    res.json(foundCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
