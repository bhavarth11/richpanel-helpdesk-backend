require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.createSecretToken = (user) => {
  return jwt.sign(user, process.env.TOKEN_KEY, {
    expiresIn: 60 * 24 * 60 * 60,
  });
};