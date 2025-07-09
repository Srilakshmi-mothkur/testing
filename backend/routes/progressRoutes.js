const express = require("express");
const router = express.Router();
const { addProgressEntry, suggestActivity } = require("../controllers/progressController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/:studentId/add", protect, upload.single("photo"), addProgressEntry);
router.get("/suggest-activity/:studentId", protect, suggestActivity);

module.exports = router;
