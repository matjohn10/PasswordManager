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

const encrypt = (password: string): { iv: string; password: string } => {
  const iv = Buffer.from(crypto.randomBytes(16));
  console.log("buffer");
  const cipher = crypto.createCipheriv(
    "aes-256-ctr",
    Buffer.from(process.env.ENCRYPT_KEY || ""),
    iv
  );
  console.log("cipher");
  const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);
  console.log("encrypt");
  return { iv: iv.toString("hex"), password: encrypted.toString("hex") };
};

const decrypt = (encryption: { iv: string; password: string }): string => {
  const decipher = crypto.createDecipher(
    "aes-256-ctr",
    Buffer.from(process.env.ENCRYPTION_ALGO || ""),
    Buffer.from(encryption.iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryption.password, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString();
};

module.exports = { encode, verify, encrypt, decrypt };
