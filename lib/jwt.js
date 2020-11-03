const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models').User;

module.exports = function(){
  
  let opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.JWT_SECRET;

  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log(jwt_payload);
    User.findByPk(jwt_payload.id).then(user=>{
      done(null,user)
    }).catch(err=>{
      done(err,false)
    })
    
  }));
}