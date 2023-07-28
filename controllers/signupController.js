const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.form_get = (req, res, next) => {
    if(req.user){
        res.redirect('/home');
    } else {
        res.render('signup');
    }
};

exports.form_post = [
    body('username', 'Username must contain 3 characters.')
        .trim()
        .isLength({ min: 3 })
        .escape(),

    body('password', 'Password must contain 5 characters.')
        .trim()
        .isLength({ min: 5 })
        .escape(),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        // Check for validation errors
        if(!errors.isEmpty()){
            res.render('signup', {
                username: req.body.username,
                password: req.body.password,
                errors: errors.array(),
            });
            return;
        }

        // Hash the valid password
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if(err){ throw err; }

            // Create a new database entry
            const user = new User({
                username: req.body.username,
                password: hashedPassword,
            });

            const result = await user.save();
            res.render('login');
        });
    }),
];