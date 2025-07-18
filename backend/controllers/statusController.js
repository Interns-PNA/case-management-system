const Status = require("../models/Status");

// Get all or filtered statuses
exports.getStatuses = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive search
    }

    const statuses = await Status.find(query).sort({ name: 1 });
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch statuses" });
  }
};

// Create new status
exports.createStatus = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Status name is required" });

    const newStatus = new Status({ name });
    await newStatus.save();
    res.status(201).json(newStatus);
  } catch (err) {
    res.status(500).json({ error: "Failed to create status" });
  }
};

// Update existing status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await Status.findByIdAndUpdate(id, { name }, { new: true });
    if (!updated) return res.status(404).json({ error: "Status not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

// Delete a status
exports.deleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Status.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Status not found" });

    res.json({ message: "Status deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete status" });
  }
};
