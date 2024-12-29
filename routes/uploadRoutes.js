const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const CV = require("../models/CV");
const User = require("../models/User");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "CVs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("CVs directory created.");
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
    const fileData = {
      userId,
      filename: req.file.filename,
      path: req.file.path,
    };

    const existingFile = await CV.findOne({ where: { userId } });

    if (existingFile) {
      const fullPath = path.join(__dirname, "..", existingFile.path);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Successfully deleted old CV: ${fullPath}`);
      } else {
        console.warn(`File not found, skipping deletion: ${fullPath}`);
      }

      await existingFile.update(fileData);
    } else {
      await CV.create(fileData);
    }

    const user = await User.findByPk(userId);
    const admin = await User.findOne({ where: { isAdmin: true } });
    const notificationMessage = `${user.name} has submitted a CV for approval.`;

    const updatedNotifications = [
      ...admin.notifications,
      {
        type: "CV Upload",
        message: notificationMessage,
        path: `/cvs`,
      },
    ];
    await admin.update({ notifications: updatedNotifications });
    res.status(200).json({ message: "CV uploaded successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("An error occurred while uploading the CV.");
  }
});

module.exports = router;
