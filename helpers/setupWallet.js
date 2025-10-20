const { ethers } = require("ethers");
const bip39 = require("bip39");
const { encryptWithPassword, decryptWithPassword } = require("../utils/crypto");
const UserWallet = require("../models/UserWallet");
const { verifyUserPassword } = require("./authHelper");

const createWallet = async (userId, password) => {
  await verifyUserPassword(userId, password);

  const mnemonic = bip39.generateMnemonic(128);
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);

  const encryptedSeed = encryptWithPassword(mnemonic, password);

  const newWallet = await UserWallet.create({
    userId,
    address: wallet.address,
    encryptedSeed,
  });

  return { address: newWallet.address, mnemonic };
};

const importWallet = async (userId, password, mnemonic) => {
  await verifyUserPassword(userId, password);
  if (!bip39.validateMnemonic(mnemonic)) throw new Error("Invalid mnemonic");

  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const encryptedSeed = encryptWithPassword(mnemonic, password);

  let existing = await UserWallet.findOne({ address: wallet.address });
  if (!existing) {
    existing = await UserWallet.create({
      userId,
      address: wallet.address,
      encryptedSeed,
    });
  }

  return { address: wallet.address };
};

const recoverWallet = async (userId, password) => {
  await verifyUserPassword(userId, password);

  const wallet = await UserWallet.findOne({ userId });
  if (!wallet) throw new Error("No wallet found for this user");

  const mnemonic = decryptWithPassword(wallet.encryptedSeed, password);
  if (!mnemonic) throw new Error("Failed to decrypt. Wrong password?");

  return { mnemonic };
};

// const createWallet = async () => {
//   const mnemonic = bip39.generateMnemonic(128); // 12 words; 256 for `24` words
//   const wallet = ethers.Wallet.fromMnemonic(mnemonic);

//   const encryptedSeed = encryptData(mnemonic);

//   const newWallet = await UserWallet.create({
//     address: wallet.address,
//     encryptedSeed,
//   });

//   return { address: newWallet.address, mnemonic };
// };

// const importWallet = async (mnemonic) => {
//   if (!bip39.validateMnemonic(mnemonic)) {
//     throw new Error("Invalid mnemonic");
//   }

//   const wallet = ethers.Wallet.fromMnemonic(mnemonic);
//   const encryptedSeed = encryptData(mnemonic);

//   let existing = await UserWallet.findOne({ address: wallet.address });
//   if (!existing) {
//     existing = await UserWallet.create({
//       address: wallet.address,
//       encryptedSeed,
//     });
//   }

//   return { address: wallet.address };
// };

module.exports = { createWallet, importWallet, recoverWallet };
