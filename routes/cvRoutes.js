const express = require("express");
const { getCVByUserId, getAllCVs, approveCV, rejectCV } = require("../controllers/cvController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/cv", authMiddleware, getCVByUserId);

router.get("/admin/cvs", authMiddleware, getAllCVs);
router.post("/admin/cv/:id/approve", authMiddleware, approveCV);
router.post("/admin/cv/:id/reject", authMiddleware, rejectCV);

module.exports = router;
