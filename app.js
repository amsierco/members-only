//const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const express = require('express');
const path = require('path');
const session = require("express-session");
const MemoryStore = require('memorystore')(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const CustomStrategy = require("passport-custom").Strategy;
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const clubRouter = require('./routes/club');

const User = require('./models/user');

require('dotenv').config();

// Set up mongoose connection
const mongoDB = process.env.DATABASE_CONNECTION;
console.log('TEST:'+mongoDB);
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));

// Session
app.use(session({ 
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: process.env.SECRET, 
  resave: false, 
  saveUninitialized: true 
}));

app.use(express.urlencoded({ extended: false }));

// Password verification strategy
passport.use(
  'local',
  new LocalStrategy(async(username, password, done) => {
      try {
        // Search database
        const user = await User.findOne({ username: username });
        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        };
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              // passwords match! log user in
              console.log('Logging in: ' + user);
              return done(null, user)
            } else {
              // passwords do not match!
              return done(null, false, { message: "Incorrect password" })
            }
          });
      } catch(err) {
        return done(err);
      };
  })
);

// Club code verification strategy
passport.use(
  'code',
  new CustomStrategy(async(req, done) => {
    try{
      if(req.body.code === process.env.MEMBER_CODE){
        // Update user's membership
        const updated_user = await User.findOneAndUpdate(
            { _id: req.user._id },
            { member: true },
            { new: true }
        );
        return done(null, updated_user);
      } else {
        return done (null, false, { message: "Incorrect password" });
      }
    } catch(err) {
      return done(err);
    };
  })
)

// Guest verification strategy
passport.use(
  'guest',
  new CustomStrategy(async(req, done) => {
    try{
      const guest_user = await User.findOne(
        { _id: process.env.GUEST_ID }
      );
      return done(null, guest_user);

    } catch(err) {
      return done(err);
    };
  })
)

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function(_id, done) {
  try {
      const user = await User.findById(_id);
      done(null, user);
  } catch(err) {
      done(err);
  };
});

// Use passport as middleware and with the current session
app.use(passport.initialize());
app.use(passport.session());

// Makes user login status avaliable throughout entire app with Express's locals Object
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/home', clubRouter);

// Logout
app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

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
