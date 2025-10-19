const mongoose = require("mongoose");
require("dotenv").config();

const DB = process.env.MONGO_URI;

mongoose.connect(DB, {}).then(() => {
  console.log("DB connection successful!");
});
