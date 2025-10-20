const CryptoJS = require("crypto-js");
const bcrypt = require("bcryptjs");

// const SECRET = process.env.ENCRYPTION_KEY;
const PBK_WALLET_SALT = process.env.PBK_WALLET_SALT;

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/// @dev fn derives a cryptographic key from the user's password using PBKDF2.
const deriveKey = (password) => {
  return CryptoJS.PBKDF2(password, PBK_WALLET_SALT, {
    keySize: 256 / 32,
    iterations: 1000,
  }).toString();
};

// const encryptData = (text) => {
//   return CryptoJS.AES.encrypt(text, SECRET).toString();
// };

// const decryptData = (cipher) => {
//   const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
//   return bytes.toString(CryptoJS.enc.Utf8);
// };

const encryptWithPassword = (text, password) => {
  const key = deriveKey(password);
  return CryptoJS.AES.encrypt(text, key).toString();
};

const decryptWithPassword = (cipher, password) => {
  const key = deriveKey(password);
  const bytes = CryptoJS.AES.decrypt(cipher, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  hashPassword,
  verifyPassword,
  deriveKey,
  encryptWithPassword,
  decryptWithPassword,
};
