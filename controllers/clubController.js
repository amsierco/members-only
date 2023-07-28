const asyncHandler = require('express-async-handler');
const { body } = require("express-validator");
const passport = require("passport");
//const User = require('./models/user');

exports.home = (req, res, next) => {
    res.render('home');
};

exports.join_club_get = (req, res, next) => {
    res.render('join-club');
};

exports.join_club_post = [
    body('code').trim().escape(),
    passport.authenticate('code', { failureRedirect: "/home/join-club", failureMessage: true, successRedirect: '/home'}),
];