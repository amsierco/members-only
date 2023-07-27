var express = require('express');
var router = express.Router();

const signupController = require('../controllers/signupController');

// GET Sign up form
router.get('/', signupController.form_get);

// POST Sign up form
router.post('/', signupController.form_post);

module.exports = router;
