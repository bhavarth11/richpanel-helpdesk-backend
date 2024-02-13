const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  { type: String, value: Object },
  { strict: false }
);

const pagesSchema = new mongoose.Schema({
  name: String,
  category: String,
  id: String,
  access_token: String,
  hooksInstalled: {
    type: Boolean,
    default: false,
  },
  activity: [activitySchema],
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  userID: String,
  picture: String,
  accessToken: String,
  pages: [pagesSchema],
});

module.exports = mongoose.model("User", userSchema);
