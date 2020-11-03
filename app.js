require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const jwtGenerator = require('./lib/jwt')



let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let likesRouter = require('./routes/likes');
let videosRouter = require('./routes/videos');

var app = express();

jwtGenerator();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));


app.use(passport.initialize());

let corsConfig = {
  allowedHeaders: ['Content-Type','Authorization']
}

app.use(cors());
app.options('*', cors()) 


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/likes', passport.authenticate('jwt', { session: false }), likesRouter);
app.use("/videos", passport.authenticate('jwt', { session: false }), videosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
