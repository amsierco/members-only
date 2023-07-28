const { body } = require("express-validator");
const passport = require("passport");

exports.form_get = (req, res, next) => {
    if(req.user){
        res.redirect('/home');
    } else {
        res.render('login');
    }
};

exports.form_post = [
    body('username').trim().escape(),
    body('password').trim().escape(),
    passport.authenticate('local', { failureRedirect: "/", failureMessage: true, successRedirect: '/home'}),
];

exports.guest = passport.authenticate('guest', { failureRedirect: "/", failureMessage: true, successRedirect: '/home'});