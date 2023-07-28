const asyncHandler = require('express-async-handler');
const { body } = require("express-validator");
const passport = require("passport");

const Message = require('../models/message');

exports.home = asyncHandler(async (req, res, next) => {
    if(!req.user){ return res.redirect('/login'); }

    // Render messages
    const message_list = await Message
        .find({})
        .populate({
            path: 'author',
            select: 'username',
            model: 'User',
        })
        .exec();

    // If member is authorised
    if(req.user.member === true){
        
        res.render('home', {
            user: req.user.username,
            authorised: true,
            message_list: message_list
        });
    } else {
        // If member is not authorised
        res.render('home', {
            user: req.user.username,
            authorised: false,
            message_list: message_list
        });
    }
});

exports.join_club_get = (req, res, next) => {
    if(!req.user){ return res.redirect('/login'); }
    res.render('join-club');
};

exports.join_club_post = [
    body('code').trim().escape(),
    passport.authenticate('code', { failureRedirect: "/home/join-club", failureMessage: true, successRedirect: '/home'}),
];

exports.create_message = [
    // Sanitize message
    body('user-message').trim().escape(),

    // Create new database entry
    asyncHandler(async (req, res, next) => {
        let current_date = new Date()
        const new_message = new Message({
            author: req.user,
            message: req.body.user_message,
            date_posted: current_date
        });
        const result = await new_message.save();

        // Render messages
        res.redirect('/home');
    })
];