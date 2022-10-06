import crypto from "crypto";

const createKey = () => {
  return crypto.randomBytes(32).toString("hex").substr(0, 10);
};

export default createKey;
