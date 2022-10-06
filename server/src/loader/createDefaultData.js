import bcrypt from "bcrypt";

import { User, Setting } from "../db/models";
import createKey from "../utils/createKey";
import AccountsService from "../services/Accounts.service";
import SettingsService from "../services/Settings.service";

const AccountsServiceInstance = new AccountsService(User);
const SettingsServiceInstance = new SettingsService(Setting);

export default async () => {
  const hash = await bcrypt.hash("1111", 12);
  const verifyKey = await createKey();
  const existAdmin = await AccountsServiceInstance.findByEmail(
    "admin@admin.com"
  );
  if (!existAdmin) {
    await AccountsServiceInstance.create({
      name: "최고관리자",
      email: "admin@admin.com",
      password: hash,
      role: "admin",
      verified: true,
      companyName: "-",
      companyCode: "-",
      companyAddrCode: "-",
      companyAddr1: "-",
      companyAddr2: "-",
      companyAddr3: "-",
    });
  }

  const existSetting = await SettingsServiceInstance.findByPk(1);
  if (!existSetting) {
    await SettingsServiceInstance.create();
  }
};
