var express = require('express');
var router = express.Router();
const Video = require('../models').Video;

const uploader = require('../lib/storage');
const VideoApi = require('../lib/video-api');
const validateOwner = require('../lib/validate-owner')

let show = async (req,res,next) => {
  try {
    let video = req.video.dataValues;
    res.json(video);  
  } catch (error) {
    next(error);
  }
}

let find = async (req, res, next) => {
  try {
    let video = req.video || (await Video.findByPk(req.params.id));
    if(video){
      req.video = video;
      next(); 
    }else{
      return res.sendStatus(404);
    }
    
  } catch (error) {
    next(error);
  }
}

router.route("/").get(async (req,res,next)=>{
  try{
    let videos = await Video.paginate(req.query.page, req.user.id);
    res.send(videos);
  }catch(err){
    next(err);
  }
}).post(
  uploader.single('video'),
  VideoApi.upload,
  async (req, res,next) => {
    console.log(req.remoteVideo);
    try {
      let video = await Video.create({
        title: req.body.title,
        userId: req.user.id,
        remoteVideoId: req.remoteVideo.videoId,
        thumbnail: req.remoteVideo.assets.thumbnail
      });
      req.video = video;
      next();  
    } catch (error) {
      next(error);
    }  
  },show
)

router.route("/:id")
  .get(find, show)
  .patch(find,validateOwner, async (req,res,next)=>{
    try {
      req.video.title = req.body.video.title;
      await req.video.save();
      if(req.video.remoteVideoId) return next();
      show(req,res,next);
    } catch (error) {
      next(error);
    }
  }, VideoApi.update, show)
  .delete(find,validateOwner, async (req,res,next)=>{
    await req.video.destroy();
    next();
  },VideoApi.delete,(req,res) => res.sendStatus(200))


module.exports = router;
