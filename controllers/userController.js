const { User, Notification, UserNotification } = require("../models");

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

    // Update user information with the request body
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

module.exports = { authController, updateUserController };
