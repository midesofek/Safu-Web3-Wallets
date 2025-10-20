const mongoose = require("mongoose");

const UserWalletSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
  encryptedSeed: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UserWallet = mongoose.model("UserWallet", UserWalletSchema);
module.exports = UserWallet;
