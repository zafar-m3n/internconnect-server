const { User } = require("../models");

const authController = async (req, res) => {
  try {
    const user = await User.findByPk(req.body.userId);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).send({
      success: true,
      message: "User found successfully",
      data: user,
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
