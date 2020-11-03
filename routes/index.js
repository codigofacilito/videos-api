var express = require('express');
const passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/',passport.authenticate('jwt',{session:false}) ,function(req, res) {
  res.json(req.user);
});

module.exports = router;
