const crypto = require("crypto");
require("dotenv").config();

type encryptionOptions = {
  algo: String;
  salt: String;
  iterations: Number;
};

const encode = (password: String, options: encryptionOptions) => {
  const hash = crypto.pbkdf2Sync(
    password,
    options.salt,
    options.iterations,
    32,
    "sha256"
  );
  return `${options.algo}$${options.iterations}$${options.salt}$${hash.toString(
    "hex"
  )}`;
};

const decode = (encoded: String): encryptionOptions => {
  const [algo, iterations, salt, hash] = encoded.split("$");
  const options = {
    algo,
    salt,
    iterations: parseInt(iterations, 10),
  };
  return options;
};

const verify = (password: String, encoded: String) => {
  const decoded = decode(encoded);
  const encodedPassword = encode(password, decoded);
  return encoded === encodedPassword;
};

module.exports = { encode, verify };
