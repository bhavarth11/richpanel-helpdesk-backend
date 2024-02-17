const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  { type: String, value: Object },
  { strict: false }
);

const fbPagesSchema = new mongoose.Schema({
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

const fbUserSchema = new mongoose.Schema({
  agentID: mongoose.Types.ObjectId,
  name: String,
  email: String,
  userID: String,
  picture: String,
  accessToken: String,
  tokenType: {
    type: String,
    default: 'short-lived'
  },
  pages: [fbPagesSchema],
});

module.exports = mongoose.model("FBUser", fbUserSchema);
