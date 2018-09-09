var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var passport = require('passport');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var router = require('../routes/index');
const config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.JWT_SECRET));
app.use(cors({/*credentials: true, origin: 'http://localhost:4200'*/})); 

app.use(session({
  /*genid: () => {
    return uuid() // use UUIDs for session IDs
  },*/
  secret: config.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  // store: new MongoStore({
  //   url: config.MONGO_HOST+config.Mongo_DB,
  //   collection: 'sessions'
  // }),
  cookie : {
    secure: false
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../public')));
app.use('/', router);

require('./passport-local');
require('./passport-jwt');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
