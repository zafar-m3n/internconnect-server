const UserModel = require("../models/User");

const authController = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.body.userId);
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Authorization Error",
      success: false,
      error,
    });
  }
};

module.exports = { authController };
