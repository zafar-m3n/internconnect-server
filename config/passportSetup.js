const passport = require("passport");
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("../models/User"); // Make sure to import your User model
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
        // Try to find the user by Microsoft ID using Sequelize
        const currentUser = await User.findOne({
          where: { microsoftId: profile.id },
        });

        console.log("Current user found:", currentUser);

        if (currentUser) {
          // If the user exists, return them
          return done(null, currentUser);
        } else {
          // If the user doesn't exist, create a new one
          const newUser = await User.create({
            microsoftId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePic: profile.photos
              ? profile.photos[0].value
              : "/images/profile.png",
          });

          console.log("New user created:", newUser);

          // Return the newly created user
          return done(null, newUser);
        }
      } catch (error) {
        console.error("Error processing user:", error);
        done(error);
      }
    }
  )
);
