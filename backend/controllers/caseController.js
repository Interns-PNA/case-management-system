const Case = require("../models/Case");
const path = require("path");
const fs = require("fs");

// Create a new case
exports.createCase = async (req, res) => {
  try {
    const caseData = { ...req.body };

    // Parse JSON strings from FormData
    if (caseData.judges && typeof caseData.judges === "string") {
      try {
        caseData.judges = JSON.parse(caseData.judges);
      } catch (e) {
        // If parsing fails, treat as single value
        caseData.judges = [caseData.judges];
      }
    }

    if (caseData.caseRemarks && typeof caseData.caseRemarks === "string") {
      try {
        caseData.caseRemarks = JSON.parse(caseData.caseRemarks);
      } catch (e) {
        caseData.caseRemarks = [];
      }
    }

    // Handle main file upload
    if (req.files && req.files.caseFile) {
      caseData.files = [req.files.caseFile[0].filename];
    }

    // Handle case remarks files
    if (caseData.caseRemarks && Array.isArray(caseData.caseRemarks)) {
      caseData.caseRemarks = caseData.caseRemarks.map((remark, index) => {
        if (req.files && req.files[`remarkFile_${index}`]) {
          return {
            ...remark,
            file: req.files[`remarkFile_${index}`][0].filename,
          };
        }
        return remark;
      });
    }

    const newCase = new Case(caseData);
    const saved = await newCase.save();
    const populated = await Case.findById(saved._id).populate(
      "court judges subjectMatter location"
    );
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all cases
exports.getCases = async (req, res) => {
  try {
    // Build filter object based on query parameters
    let filter = {};

    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by date range if provided
    if (req.query.startDate || req.query.endDate) {
      const isDateOnly = (s) =>
        typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
      const toLocalDate = (s, endOfDay = false) => {
        if (!s) return null;
        if (isDateOnly(s)) {
          const [y, m, d] = s.split("-").map(Number);
          if (endOfDay) return new Date(y, m - 1, d, 23, 59, 59, 999);
          return new Date(y, m - 1, d, 0, 0, 0, 0);
        }
        const dt = new Date(s);
        return isNaN(dt) ? null : dt;
      };

      const startRaw = req.query.startDate;
      const endRaw = req.query.endDate;

      let start = toLocalDate(startRaw, false);
      let end = toLocalDate(endRaw, !!endRaw && isDateOnly(endRaw));

      // If both provided and date-only and same day, ensure end is end-of-day
      if (
        startRaw &&
        endRaw &&
        isDateOnly(startRaw) &&
        isDateOnly(endRaw) &&
        start &&
        end
      ) {
        const sameDay =
          start.getFullYear() === end.getFullYear() &&
          start.getMonth() === end.getMonth() &&
          start.getDate() === end.getDate();
        if (sameDay) {
          end = toLocalDate(endRaw, true);
        }
      }

      filter.nextHearingDate = {};
      if (start) filter.nextHearingDate.$gte = start;
      if (end) filter.nextHearingDate.$lte = end;
    }

    const cases = await Case.find(filter).populate(
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
    console.log("Update request received for case:", req.params.id);
    console.log("Request body keys:", Object.keys(req.body));
    console.log("Files received:", req.files ? Object.keys(req.files) : "none");

    const caseData = { ...req.body };

    // Parse JSON strings from FormData
    if (caseData.judges && typeof caseData.judges === "string") {
      try {
        caseData.judges = JSON.parse(caseData.judges);
      } catch (e) {
        console.log("Failed to parse judges:", e.message);
        // If parsing fails, treat as single value
        caseData.judges = [caseData.judges];
      }
    }

    if (caseData.caseRemarks && typeof caseData.caseRemarks === "string") {
      try {
        caseData.caseRemarks = JSON.parse(caseData.caseRemarks);
      } catch (e) {
        console.log("Failed to parse caseRemarks:", e.message);
        caseData.caseRemarks = [];
      }
    }

    // Handle main file upload
    if (req.files && req.files.caseFile) {
      caseData.files = [req.files.caseFile[0].filename];
    } else {
      // If no new file uploaded, preserve existing files by not setting caseData.files
      // This way MongoDB will keep the existing files array
      delete caseData.files;
    }

    // Handle case remarks files
    if (caseData.caseRemarks && Array.isArray(caseData.caseRemarks)) {
      caseData.caseRemarks = caseData.caseRemarks.map((remark, index) => {
        if (req.files && req.files[`remarkFile_${index}`]) {
          return {
            ...remark,
            file: req.files[`remarkFile_${index}`][0].filename,
          };
        }
        return remark;
      });
    }

    console.log("Final caseData for update:", Object.keys(caseData));

    const updated = await Case.findByIdAndUpdate(req.params.id, caseData, {
      new: true,
    }).populate("court judges subjectMatter location");
    if (!updated) return res.status(404).json({ error: "Case not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update case error:", err);
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

// Download file by filename
exports.downloadFile = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads", filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Send file
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).json({ error: "Error downloading file" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
