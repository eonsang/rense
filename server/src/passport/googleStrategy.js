import passport from "passport";
import { OAuthStrategy as GoogleStrategy } from "passport-google-oauth";

import { User } from "../db/models";
import AccountsService from "../services/Accounts.service";
import createKey from "../utils/createKey";

const AccountsServiceInstance = new AccountsService(User);

require("dotenv").config();
export default () => {
  passport.use(
    new GoogleStrategy(
      {
        consumerKey: process.env.GOOGLE_CONSUMER_KEY,
        consumerSecret: process.env.GOOGLE_CONSUMER_SECRET,
        callbackURL: "/accounts/google/callback",
      },
      function (token, tokenSecret, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    )
  );
};
