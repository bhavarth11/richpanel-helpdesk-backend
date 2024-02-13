const express = require("express");
const router = express.Router();

const authRoutes = require("./authentication");
const webhookRoutes = require("./webhook");
const messageRoutes = require("./message");

router.use("/auth", authRoutes);
router.use("/webhook", webhookRoutes);
router.use("/message", messageRoutes);

module.exports = router;
