const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/userModel");

const findOrCreate = require("mongoose-findorcreate");
const GOOGLE_CLIENT_ID =
  "242805264111-9e1dvcju56d87bvp5qmlndh6s4ffikb4.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          pic: profile.photos[0].value,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
