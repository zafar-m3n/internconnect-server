const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  authController,
  updateUserController,
  markNotificationsAsRead,
  deleteReadNotifications,
} = require("../controllers/userController");

const router = express.Router();

router.post("/getUserData", authMiddleware, authController);
router.patch("/update", authMiddleware, updateUserController);
router.put("/notifications/read", authMiddleware, markNotificationsAsRead);
router.delete("/notifications/delete", authMiddleware, deleteReadNotifications);

module.exports = router;
