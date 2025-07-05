const express = require('express');
const router = express.Router();
const Judge = require('../models/Judge');

router.post('/', async (req, res) => {
  try {
    const { name, court, location } = req.body;
    const judge = new Judge({ name, court, location });
    const saved = await judge.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const judges = await Judge.find().populate('court').populate('location');
    res.json(judges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, court, location } = req.body;
    const updated = await Judge.findByIdAndUpdate(
      req.params.id,
      { name, court, location },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Judge.findByIdAndDelete(req.params.id);
    res.json({ message: 'Judge deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
