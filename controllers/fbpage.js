const axios  = require("axios");
const FBUser = require("../models/fbpage");


exports.getFBPageData = async (req, res) => {
  try {
    let fbUser = await FBUser.findOne({agentID: req.agent._id});
    if(fbUser && fbUser.tokenType == 'short-lived') {
      const accessTokenRes =  await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.APP_ID}&client_secret=${process.env.APP_SECRET}&fb_exchange_token=${fbUser.accessToken}`);
      if(accessTokenRes.status == '200') {
        const fbPageRes = await axios.get(`https://graph.facebook.com/v19.0/${fbUser.userID}/accounts?access_token=${fbUser.accessToken}`);
        if(fbPageRes) {
          fbUser.accessToken = accessTokenRes.data.access_token;
          fbUser.pages = fbPageRes.data.data;
          fbUser.tokenType = 'long-lived'
          await fbUser.save();
        }
      }
      else {
        return res.json(null);
      }      
    }
    return res.json(fbUser);
  }
  catch (err) {
    res.json({
      error: err,        
    }).status(500);
  }

};

exports.connectFBPage = (req, res) => {    
    FBUser.findOne({ userID: req.body.userID }, async (err, user) => {
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
        const existingFBUser = await FBUser.findOne({
          agentID: req.agent._id
        });
        if (existingFBUser) {
          await findOne.findByIdAndDelete(existingFBUser._id);
        }
        const newFBUser = new FBUser({
          agentID: req.agent._id,
          name,
          email,
          picture: image,
          userID,
          accessToken,
          pages: pagesArray,
        });
  
        newFBUser.save((err, created_user) => {
          if (err) {
            res.status(200).json(err);
          } else {
            res.status(200).json(created_user);
          }
        });
      }
    });
  }

  exports.disconnectFBPage = async (req, res) => {
    try {
      await FBUser.deleteMany({agentID: req.agent._id});      
      return res.json({success: true, message: 'Succesfully disconnected FB page!'});
    }
    catch (err) {
      res.json({
        error: err,        
      }).status(500);
    }
  
  };