var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models').User;
const Video = require('../models').Video;

const passport = require('passport');

let show = async (req, res, next) => {
  try {
    res.json({ user: { ...req.user.dataValues, jwtToken: req.token} });
  } catch (error) {
    next(error);
  }
}

let generateToken = async(req,res,next) => {
  req.token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: 2592000 
  });
  next();
}

let find = async (req, res, next) => {
  try {
    let user = req.user || (await User.findByCredentials(req.body));
    if (user) {
      req.user = user;
      next();
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
}

router.route("/").post(async (req,res,next)=>{
  try {
    req.user = await User.create(req.body.user)  
    next();
  } catch (error) {
    res.status(406).json(error);
  }  
}, generateToken, show);

router.route("/videos").get(passport.authenticate('jwt', { session: false }),async (req,res,next)=>{
  Video.findAll({ limit: 20, where: { userId: req.user.id } }).then(videos => {
    res.send(videos);
  }).catch(err => {
    res.send("Error!");
  })
})

router.route("/signin").post(find,generateToken,show);

module.exports = router;
