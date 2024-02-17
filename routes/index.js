const express = require("express");
const router = express.Router();

const authRoutes = require("./authentication");
const webhookRoutes = require("./webhook");
const messageRoutes = require("./message");
const fbpageRoutes = require("./fbpage");

const authMiddleware = require("../middlewares/auth")

router.use("/auth", authRoutes);
router.use("/fb", authMiddleware, fbpageRoutes);
router.use("/webhook", webhookRoutes);
router.use("/message", messageRoutes);


module.exports = router;
