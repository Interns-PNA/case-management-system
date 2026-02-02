const express = require("express");
const router = express.Router();
const {
  getStatuses,
  createStatus,
  updateStatus,
  deleteStatus,
} = require("../controllers/statusController");

router.get("/", getStatuses); // supports optional ?search=query
router.post("/", createStatus);
router.put("/:id", updateStatus);
router.delete("/:id", deleteStatus);

module.exports = router;
