const passport = require("passport");
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const dotenv = require("dotenv");
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

passport.use(
  new MicrosoftStrategy(
    {
      callbackURL: `${process.env.NODE_INTERNCONNECT_BASEURL}/api/v1/auth/microsoft/redirect`,
      clientID: process.env.NODE_INTERNCONNECT_MICROSOFT_CLIENT_ID,
      clientSecret: process.env.NODE_INTERNCONNECT_MICROSOFT_CLIENT_SECRET,
      scope: ["openid", "profile", "email", "User.Read"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const currentUser = await sequelize.query(
          "SELECT * FROM users WHERE microsoftId = :microsoftId",
          {
            replacements: { microsoftId: profile.id },
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        console.log("Current user found:", currentUser);

        if (currentUser && currentUser.length > 0) {
          return done(null, currentUser[0]);
        } else {
          const result = await sequelize.query(
            "INSERT INTO users (microsoftId, name, email, profilePic) VALUES (:microsoftId, :name, :email, :profilePic)",
            {
              replacements: {
                microsoftId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePic: profile.photos
                  ? profile.photos[0].value
                  : "/images/profile.png",
              },
              type: Sequelize.QueryTypes.INSERT,
            }
          );

          console.log("New user created with raw SQL:", result);
          const newUser = await sequelize.query(
            "SELECT * FROM users WHERE microsoftId = :microsoftId",
            {
              replacements: { microsoftId: profile.id },
              type: Sequelize.QueryTypes.SELECT,
            }
          );

          return done(null, newUser[0]);
        }
      } catch (error) {
        console.error("Error processing user:", error);
        done(error);
      }
    }
  )
);
