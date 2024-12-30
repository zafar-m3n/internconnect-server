const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    JWT.verify(token, process.env.NODE_INTERNCONNECT_JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(200).send({
          message: "Authorization Failed",
          success: false,
        });
      } else {
        req.body.userId = decode.user;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "Authorization Failed",
      success: false,
    });
  }
};
