const apiVideo = require('@api.video/nodejs-sdk');

const client = new apiVideo.ClientSandbox({ apiKey: process.env.VIDEO_API_API_KEY });

module.exports = {
  upload: function (req, res, next) {
    console.log("Absolute PATH: " + __dirname + '/uploads/' + req.videoFile);
    client.videos.upload(__dirname + '/../uploads/' + req.videoFile, { title: req.body.title }).then(remoteVideo => {
      req.remoteVideo = remoteVideo;
      next()
    }).catch(err => {
      console.log(err);
      return res.json(err);
    })
  },
  show:  async (req, res, next) => {
    let video = await client.videos.get(req.video.remoteVideoId);
    req.assets = video.assets;
    next();
  },
  update: async (req,res,next)=>{
    await client.videos.update(req.video.remoteVideoId, { title: req.video.title });
    next();
  },
  delete: async (req,res,next)=>{
    try {
      let r = await client.videos.delete(req.video.remoteVideoId);  
      console.log(r);
      next();
    } catch (error) {
      next(error);
    }
    
    
  }
}