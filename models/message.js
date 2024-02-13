const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  recipient: String,
  timestamp: Number,
  date: Date,
  isFromCustomer: Boolean,
  message: {
    text: { type: String, required: true },
    attachments: [
      {
        type: String,
      },
    ],
  },
});

module.exports = mongoose.model("Message", messageSchema);
