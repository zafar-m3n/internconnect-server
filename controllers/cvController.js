const { CV, User, Notification, UserNotification } = require("../models");
const { Op } = require("sequelize");

exports.getCVByUserId = async (req, res) => {
  const userId = req.body.userId;

  try {
    const userCV = await CV.findOne({ where: { userId } });

    if (!userCV) {
      return res.status(200).json({
        success: false,
        message: "No CV uploaded.",
      });
    }

    res.status(200).json({
      success: true,
      userCV,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "An error occurred while fetching the CV." });
  }
};

exports.getAllCVs = async (req, res) => {
  const { page = 1, limit = 10, search, sortBy = "date", batchCode } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Dynamic where clause
    const whereClause = {
      ...(search
        ? {
            [Op.or]: [
              { "$user.name$": { [Op.like]: `%${search}%` } },
              { "$user.email$": { [Op.like]: `%${search}%` } },
            ],
          }
        : {}),
      ...(sortBy === "batchCode" && batchCode ? { "$user.batchCode$": batchCode } : {}),
    };

    // Sorting logic
    const order = sortBy === "batchCode" ? [["user", "batchCode", "ASC"]] : [["uploadDate", "DESC"]];

    const { rows: cvs, count } = await CV.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "batchCode"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
    });

    res.status(200).json({
      success: true,
      cvs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      totalCVs: count,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "An error occurred while fetching CVs." });
  }
};

exports.approveCV = async (req, res) => {
  const { id } = req.params;

  try {
    const cv = await CV.findByPk(id);

    if (!cv) {
      return res.status(200).json({
        success: false,
        message: "CV not found.",
      });
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

    res.status(200).json({
      success: true,
      message: "CV approved successfully.",
    });
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
      return res.status(200).json({
        success: false,
        message: "CV not found.",
      });
    }

    await cv.update({ status: "rejected" });

    const notification = await Notification.create({
      title: "CV Rejection",
      message: `Your CV has been rejected. Click to view more details."}`,
      isBatchNotification: false,
      path: "/profile",
    });

    await UserNotification.create({
      userId: cv.userId,
      notificationId: notification.id,
    });

    res.status(200).json({
      success: true,
      message: "CV rejected successfully.",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "An error occurred while rejecting the CV." });
  }
};
