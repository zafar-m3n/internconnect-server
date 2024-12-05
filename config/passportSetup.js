const passport = require("passport");
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const User = require("../models/User");
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
        const currentUser = await User.findOne({
          where: { microsoftId: profile.id },
        });
        if (currentUser) {
          return done(null, currentUser);
        } else {
          const newUser = await User.create({
            microsoftId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePic: profile.photos
              ? profile.photos[0].value
              : "/images/profile.png",
          });
          return done(null, newUser);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
