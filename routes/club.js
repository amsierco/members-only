var express = require('express');
var router = express.Router();

const clubController = require('../controllers/clubController');

// GET home page
router.get('/', clubController.home);

// GET join-club page
router.get('/join-club', clubController.join_club_get);

// POST join-club page
router.post('/join-club', clubController.join_club_post);

// POST new message form
// ADD THIS URL TO THE FORM'S ACTION
router.post('/create-message', clubController.create_message);

module.exports = router;
