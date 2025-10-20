const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../utils/crypto");

const createUser = async (password) => {
  const passwordHash = await hashPassword(password);
  const user = await User.create({ passwordHash });
  return { userId: user._id };
};

const verifyUserPassword = async (userId, password) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new Error("Invalid password");

  return true;
};

module.exports = {
  createUser,
  verifyUserPassword,
};
