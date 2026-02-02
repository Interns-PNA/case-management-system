const express = require("express");
const router = express.Router();
const benchController = require("../controllers/benchController");

// GET all benches
router.get("/", benchController.getBenches);

// POST create a new bench
router.post("/", benchController.createBench);

// PUT update a bench
router.put("/:id", benchController.updateBench);

// DELETE a bench
router.delete("/:id", benchController.deleteBench);

module.exports = router;
