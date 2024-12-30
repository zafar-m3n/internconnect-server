const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { CV, User, Notification, UserNotification } = require("../models");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "CVs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const nameWithoutExt = file.originalname.replace(path.extname(file.originalname), "").split(" ").join("-");
    cb(null, `${nameWithoutExt}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  const userId = req.body.userId;

  try {
    const relativePath = path.join("CVs", req.file.filename);
    const fileData = {
      userId,
      filename: req.file.filename,
      path: relativePath,
    };

    const existingFile = await CV.findOne({ where: { userId } });
    if (existingFile) {
      const fullPath = path.join(__dirname, "..", existingFile.path);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      } else {
        console.warn(`File not found, skipping deletion: ${fullPath}`);
      }

      await existingFile.update(fileData);
    } else {
      await CV.create(fileData);
    }

    const user = await User.findByPk(userId);
    const admin = await User.findOne({ where: { isAdmin: true } });

    if (!admin) {
      return res.status(404).json({ message: "Admin user not found." });
    }

    // Create a notification
    const notification = await Notification.create({
      title: "CV Upload",
      message: `${user.name} has submitted a CV for approval.`,
      isBatchNotification: false,
    });

    // Link the notification to the admin user
    await UserNotification.create({
      userId: admin.id,
      notificationId: notification.id,
    });

    res.status(200).json({ message: "CV uploaded successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("An error occurred while uploading the CV.");
  }
});

module.exports = router;
