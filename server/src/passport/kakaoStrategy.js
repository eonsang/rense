import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";

import { User } from "../db/models";
import AccountsService from "../services/Accounts.service";
import createKey from "../utils/createKey";
import logger from "../loader/winston";

const AccountsServiceInstance = new AccountsService(User);

require("dotenv").config();

export default () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_KEY,
        callbackURL: "/accounts/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const {
            id,
            username: name,
            displayName: nickname,
            _json: {
              // eslint-disable-next-line camelcase
              properties: { profile_image },
              kakao_account: { email },
            },
          } = profile;
          const existUser = await AccountsServiceInstance.findByEmail(email);
          if (existUser) {
            existUser.verified = true;
            existUser.snsId = id;
            existUser.provider = "kakao";
            // eslint-disable-next-line camelcase
            existUser.thumbnail = profile_image;
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
              provider: "kakao",
              verified: true,
              verifyKey,
            });
            logger.info(`${name} kakao 회원가입`);
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
