const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");

// Create
router.post("/", caseController.createCase);
// Read all
router.get("/", caseController.getCases);
// Read one
router.get("/:id", caseController.getCaseById);
// Update
router.put("/:id", caseController.updateCase);
// Delete
router.delete("/:id", caseController.deleteCase);

module.exports = router;
