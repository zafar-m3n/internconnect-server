const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

router.get(
  "/microsoft",
  passport.authenticate("microsoft", { session: false })
);

router.get(
  "/microsoft/redirect",
  passport.authenticate("microsoft", {
    session: false,
    failureRedirect: `${process.env.NODE_INTERNCONNECT_REACT_BASEURL}/auth/login`,
  }),
  (req, res) => {
    const token = jwt.sign(
      { user: req.user.id },
      process.env.NODE_INTERNCONNECT_JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.redirect(
      `${process.env.NODE_INTERNCONNECT_REACT_BASEURL}/auth/success?token=${token}`
    );
  }
);

router.get("/logout", (req, res) => {
  res.send("Logout");
});

module.exports = router;
