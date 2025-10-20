const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
