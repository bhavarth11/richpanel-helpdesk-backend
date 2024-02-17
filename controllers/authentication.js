const Agent = require("../models/agent");
const { createSecretToken } = require("../utils/JWT");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, remember } = req.body;
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.json({ message: "Agent already exists" });
    }
    const newAgent = await Agent.create({name, email, password});
    const token = createSecretToken({_id: newAgent._id, name, email});
    res.cookie("token", token, {
      withCredentials: true,
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * (remember ? 60 : 1)
    });
    res
      .status(201)
      .json({ message: "Agent signed in successfully", success: true, newAgent: {_id: newAgent._id, name, email} });
  } catch (error) {
    console.error(error);
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password, remember } = req.body;
    if(!email || !password ){
      return res.json({message:'All fields are required'})
    }
    const agent = await Agent.findOne({ email });
    if(!agent){
      return res.json({message:'Incorrect password or email' }) 
    }
    const auth = await bcrypt.compare(password,agent.password)
    if (!auth) {
      return res.json({message:'Incorrect password or email' }) 
    }
    const token = createSecretToken({_id: agent._id, name: agent.name,email: agent.email})
     res.cookie("token", token, {
       withCredentials: true,
       sameSite: "none",
       secure: true,
       httpOnly: true,
       maxAge: 24 * 60 * 60 * 1000 * (remember ? 60 : 1)
     });
     res.status(201).json({ message: "Agent logged in successfully", success: true, agent:  {_id: agent._id, name: agent.name,email: agent.email}});
  } catch (error) {
    console.error(error);
  }
}

exports.verify = async (req, res) => {
  try {
    const token = req.cookies.token;
    if(!token) {
      return res.json(false);
    }
    const verifiedAgent = jwt.verify(token, process.env.TOKEN_KEY); 
    res.status(201).json(verifiedAgent);
  } catch (error) {
    res.json(false);
  }
}

exports.logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    }).send();
  } catch (error) {
    res.json({
      message: "Unable to logout"
    });
  }
}