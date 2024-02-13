const express = require("express");
const router = express.Router();
const axios = require("axios");
const Message = require("../models/message");

router.get("/", async (req, res) => {
  let prevDate = new Date();
  prevDate.setDate(new Date().getDate() - 1);

  let messages = await Message.aggregate([
    {
      $match: {
        date: {
          $gte: prevDate,
        },
      },
    },
    {
      $group: {
        _id: "$sender",
        lastMessageDate: {
          $last: "$date",
        },
        messages: {
          $push: "$$ROOT",
        },
      },
    },
    {
      $sort: {
        lastMessageDate: -1,
      },
    },
  ]);
  res.json(messages);
});

router.post("/send", async (req, res) => {
  const { pageAccessToken, senderId, message } = req.body;

  // Send the HTTP request to the Messenger Platform
  // Make the axios request
  const requestBody = {
    recipient: {
      id: senderId,
    },
    message: message,
  };
  try {
    let result = await axios.post(
      `https://graph.facebook.com/v19.0/me/messages?access_token=${pageAccessToken}`,
      requestBody
    );

    let newMessage = new Message({
      sender: senderId,
      date: new Date(),
      message: message,
      isFromCustomer: false,
    });

    await newMessage.save();
    res.send("Message sent successfully!");
  } catch (error) {
    console.error("Unable to send message:" + error);
  }
});

module.exports = router;
