var express = require('express');
var router = express.Router();
const Like = require('../models').Like;


let validateOwner = (req, res, next) => {
  console.log(req.like.userId,req.user.id);
  if (req.like.userId === req.user.id) return next();
  res.sendStatus(401);
}

let show = async (req, res, next) => {
  try {
    res.json(req.like.dataValues);
  } catch (error) {
    next(error);
  }
}

let find = async (req, res, next) => {
  console.log(req.user.id)
  try {
    let like = await Like.findOne({
      where: {videoId: req.params.videoId, userId: req.user.id}
    });
    
    if (like) {
      req.like = like;
      next();
    } else {
      return res.sendStatus(404);
    }

  } catch (error) {
    next(error);
  }
}


router.route("/").post(
  async (req, res, next) => {
    try {
      let like = await Like.saveForVideoAndUser(req.user.id, req.body.like.videoId);
      req.like = like;
      next();
    } catch (error) {
      next(error);
    }
  }, show
).get(async (req, res, next) => {
  let likes = await Like.findAll()
  res.json(likes);
})

router.route("/:videoId").delete(find, validateOwner, async (req, res) => {
  await req.like.destroy();
  res.sendStatus(200)
})


module.exports = router;