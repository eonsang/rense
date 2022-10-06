import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

import { User } from "../db/models";
import AccountsService from "../services/Accounts.service";

const AccountsServiceInstance = new AccountsService(User);

export default () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const existUser = await AccountsServiceInstance.findByEmail(email) || await AccountsServiceInstance.findByNumber(email);
          if (existUser) {
            // 이메일 확인
            const result = await bcrypt.compare(password, existUser.password);
            if (result) {
              // 패스워드 확인
              done(null, existUser);
            } else {
              done(null, false, {
                message: "패스워드가 일치하지 않습니다.",
              });
            }
          } else {
            done(null, false, {
              message: "가입되지 않은 이메일입니다.",
            });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
