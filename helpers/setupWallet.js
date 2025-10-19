const { ethers } = require("ethers");
const bip39 = require("bip39");
const { encryptData } = require("../utils/crypto");
const UserWallet = require("../models/UserWallet");

const createWallet = async () => {
  const mnemonic = bip39.generateMnemonic(128); // 12 words
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);

  const encryptedSeed = encryptData(mnemonic);

  const newWallet = await UserWallet.create({
    address: wallet.address,
    encryptedSeed,
  });

  return { address: newWallet.address, mnemonic }; // Implement Logic to Only return mnemonic once
};

const importWallet = async (mnemonic) => {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic");
  }

  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const encryptedSeed = encryptData(mnemonic);

  let existing = await UserWallet.findOne({ address: wallet.address });
  if (!existing) {
    existing = await UserWallet.create({
      address: wallet.address,
      encryptedSeed,
    });
  }

  return { address: wallet.address };
};

module.exports = { createWallet, importWallet };
