const Bench = require("../models/Bench");
const Court = require("../models/Court");

// Get all benches
exports.getBenches = async (req, res) => {
  try {
    const benches = await Bench.find().populate("courts");
    res.json(benches);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new bench
exports.createBench = async (req, res) => {
  try {
    const { name, courts } = req.body;
    if (!name || !courts || !courts.length) {
      return res.status(400).json({ error: "Name and courts are required" });
    }
    const bench = new Bench({ name, courts });
    await bench.save();
    const populatedBench = await Bench.findById(bench._id).populate("courts");
    res.status(201).json(populatedBench);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update a bench
exports.updateBench = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, courts } = req.body;
    if (!name || !courts || !courts.length) {
      return res.status(400).json({ error: "Name and courts are required" });
    }
    const bench = await Bench.findByIdAndUpdate(
      id,
      { name, courts },
      { new: true }
    ).populate("courts");
    if (!bench) return res.status(404).json({ error: "Bench not found" });
    res.json(bench);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a bench
exports.deleteBench = async (req, res) => {
  try {
    const { id } = req.params;
    const bench = await Bench.findByIdAndDelete(id);
    if (!bench) return res.status(404).json({ error: "Bench not found" });
    res.json({ message: "Bench deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
