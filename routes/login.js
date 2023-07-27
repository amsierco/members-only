var express = require('express');
var router = express.Router();

const loginController = require('../controllers/loginController');

// GET Login form
router.get('/', loginController.form_get);

// POST Login form
router.post('/', loginController.form_post);

module.exports = router;
