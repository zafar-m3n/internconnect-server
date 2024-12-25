const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { authController, updateUserController } = require("../controllers/userController");

const router = express.Router();

router.post("/getUserData", authMiddleware, authController);
router.patch("/update", authMiddleware, updateUserController);

module.exports = router;
