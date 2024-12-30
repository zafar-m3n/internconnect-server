const { CV, User, Notification, UserNotification } = require("../models");

exports.getCVByUserId = async (req, res) => {
  const userId = req.body.userId;

  try {
    const userCV = await CV.findOne({ where: { userId } });

    if (!userCV) {
      return res.status(404).json({ message: "No CV uploaded." });
    }

    res.status(200).json(userCV);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "An error occurred while fetching the CV." });
  }
};

exports.getAllCVs = async (req, res) => {
  try {
    const cvs = await CV.findAll({ include: [{ model: User, attributes: ["name", "email"] }] });
    res.status(200).json(cvs);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "An error occurred while fetching all CVs." });
  }
};

exports.approveCV = async (req, res) => {
  const { id } = req.params;

  try {
    const cv = await CV.findByPk(id);

    if (!cv) {
      return res.status(404).json({ message: "CV not found." });
    }

    await cv.update({ status: "approved" });

    const notification = await Notification.create({
      title: "CV Approval",
      message: "Your CV has been approved.",
      isBatchNotification: false,
      path: "/profile",
    });

    await UserNotification.create({
      userId: cv.userId,
      notificationId: notification.id,
    });

    res.status(200).json({ message: "CV approved successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "An error occurred while approving the CV." });
  }
};

exports.rejectCV = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    const cv = await CV.findByPk(id);

    if (!cv) {
      return res.status(404).json({ message: "CV not found." });
    }

    await cv.update({ status: "rejected" });

    const notification = await Notification.create({
      title: "CV Rejection",
      message: `Your CV has been rejected. Reason: ${reason || "No reason provided."}`,
      isBatchNotification: false,
      path: "/profile",
    });

    await UserNotification.create({
      userId: cv.userId,
      notificationId: notification.id,
    });

    res.status(200).json({ message: "CV rejected successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "An error occurred while rejecting the CV." });
  }
};
