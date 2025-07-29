const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const upload = require("../middleware/upload");

// Configure multer for multiple file fields
const uploadFields = upload.fields([
  { name: "caseFile", maxCount: 1 },
  { name: "remarkFile_0", maxCount: 1 },
  { name: "remarkFile_1", maxCount: 1 },
  { name: "remarkFile_2", maxCount: 1 },
  { name: "remarkFile_3", maxCount: 1 },
  { name: "remarkFile_4", maxCount: 1 },
  // Add more as needed
]);

// Create
router.post("/", uploadFields, caseController.createCase);
// Read all
router.get("/", caseController.getCases);
// Read one
router.get("/:id", caseController.getCaseById);
// Update
router.put("/:id", uploadFields, caseController.updateCase);
// Delete
router.delete("/:id", caseController.deleteCase);
// Download file
router.get("/download/:filename", caseController.downloadFile);

module.exports = router;
