const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    req.videoFile = Date.now() + path.extname(file.originalname)
    cb(null, req.videoFile);
  }
});
const fileFilter = (req, file, cb) => {
  console.debug(file);
  if (file.mimetype == 'video/mp4') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
module.exports = multer({ storage: storage });