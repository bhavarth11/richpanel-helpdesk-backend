const express = require("express");
const router = express.Router();
const { register, login, verify, logout } = require("../controllers/authentication");

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verify);
router.get('/logout', logout);

module.exports = router;
