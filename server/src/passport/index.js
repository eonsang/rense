import passport from "passport";

import localStrategy from "./localStrategy";
import kakaoStrategy from "./kakaoStrategy";
import naverStrategy from "./naverStrategy";
import { User } from "../db/models";

export default () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  localStrategy();
  kakaoStrategy();
  naverStrategy();
};
