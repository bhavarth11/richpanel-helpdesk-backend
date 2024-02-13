const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/", (req, res) => {
  User.findOne({ userID: req.body.userID }, async (err, user) => {
    const { name, email, picture, userID, accessToken, pages } = req.body;
    const pagesArray = [];
    pages.forEach((page) => {
      pagesArray.push({
        name: page.name,
        id: page.id,
        category: page.category,
        access_token: page.access_token,
      });
    });
    if (user) {
      user.accessToken = req.body.accessToken;
      user.pages.forEach((page, index) => {
        page.access_token = pagesArray[index].access_token;
      });
      user.save();
      res.status(200).json(user);
    } else {
      const image = picture.data.url;
      const newUser = new User({
        name,
        email,
        picture: image,
        userID,
        accessToken,
        pages: pagesArray,
      });

      newUser.save((err, created_user) => {
        if (err) {
          res.status(200).json(err);
        } else {
          res.status(200).json(created_user);
        }
      });
    }
  });
});

module.exports = router;
