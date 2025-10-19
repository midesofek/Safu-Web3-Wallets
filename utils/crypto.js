const CryptoJS = require("crypto-js");

const SECRET = process.env.ENCRYPTION_KEY;

const encryptData = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET).toString();
};

const decryptData = (cipher) => {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encryptData, decryptData };
