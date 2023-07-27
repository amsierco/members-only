const { body } = require("express-validator");
const passport = require("passport");

exports.form_get = (req, res, next) => {
    res.render('login');
};

exports.form_post = [
    body('username').trim().escape(),

    body('password').trim().escape(),

    // Authenticate password matches with the database
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/"
    }),
];