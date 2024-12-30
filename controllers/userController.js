const { User, Notification, UserNotification } = require("../models");
const { Sequelize } = require("sequelize");

const authController = async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    // Fetch individual notifications linked to the user
    const individualNotifications = await Notification.findAll({
      include: {
        model: UserNotification,
        as: "userNotifications",
        where: { userId },
      },
    });

    const batchNotifications = await Notification.findAll({
      where: {
        isBatchNotification: true,
        batchCode: user.batchCode,
      },
    });

    // Combine both individual and batch notifications
    const notifications = [...individualNotifications, ...batchNotifications];

    res.status(200).send({
      success: true,
      message: "User found successfully",
      data: {
        user,
        notifications,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: "Authorization Error",
      success: false,
      error: error.message,
    });
  }
};

const updateUserController = async (req, res) => {
  try {
    const user = await User.findByPk(req.body.userId);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    await user.update(req.body);

    res.status(200).send({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: "Update Error",
      success: false,
      error: error.message,
    });
  }
};

const markNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.body.userId;
    const result = await UserNotification.update(
      { seenAt: new Date() },
      {
        where: {
          userId,
          seenAt: null,
        },
      }
    );

    if (result[0] === 0) {
      return res.status(200).json({
        success: false,
        message: "You have no unread notifications.",
      });
    }

    res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const deleteReadNotifications = async (req, res) => {
  try {
    const userId = req.body.userId;
    const result = await UserNotification.destroy({
      where: {
        userId,
        seenAt: { [Sequelize.Op.ne]: null },
      },
    });

    if (result === 0) {
      return res.status(200).json({
        success: false,
        message: "You have no read notifications.",
      });
    }

    res.status(200).json({
      success: true,
      message: "All read notifications deleted.",
    });
  } catch (error) {
    console.error("Error deleting read notifications:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { authController, updateUserController, markNotificationsAsRead, deleteReadNotifications };
