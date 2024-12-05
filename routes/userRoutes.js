const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { authController } = require("../controllers/userController");

const router = express.Router();

router.post("/getUserData", authMiddleware, authController);

module.exports = router;
