const express = require("express");
const router = express.Router();
const { getFBPageData, connectFBPage, disconnectFBPage } = require("../controllers/fbpage");

router.get("/data", getFBPageData)
router.post("/connect", connectFBPage);
router.delete("/disconnect", disconnectFBPage)

module.exports = router;