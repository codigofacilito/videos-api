module.exports = (req,res,next) => {
  if(req.video.userId == req.user.id) return next();
  res.sendStatus(401);
}