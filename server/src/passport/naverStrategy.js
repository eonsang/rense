import passport from "passport";
import { Strategy as NaverStrategy } from "passport-naver";

import { User } from "../db/models";
import AccountsService from "../services/Accounts.service";
import createKey from "../utils/createKey";
import logger from "../loader/winston";

const AccountsServiceInstance = new AccountsService(User);

require("dotenv").config();

export default () => {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: process.env.NAVER_CLIENT_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const {
            id,
            displayName: name,
            // eslint-disable-next-line camelcase
            _json: { profile_image, email, nickname },
          } = profile;
          const existUser = await AccountsServiceInstance.findByEmail(email);
          if (existUser) {
            existUser.verified = true;
            existUser.snsId = id;
            existUser.provider = "naver";
            if (!existUser.thumbnail) {
              // eslint-disable-next-line camelcase
              existUser.thumbnail = profile_image;
            }
            existUser.save();
            return done(null, existUser);
          } else {
            const verifyKey = await createKey();
            const user = await AccountsServiceInstance.create({
              name,
              email,
              nickname,
              thumbnail: profile_image,
              snsId: id,
              provider: "naver",
              verified: true,
              verifyKey,
            });
            logger.info(`${name} naver 회원가입`);
            return done(null, user);
          }
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
