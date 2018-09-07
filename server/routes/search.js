const express = require('express');
const router = express.Router();
const ctrlTemplates = require('../controllers/templates.controller');
const passport = require('passport');

// search
router.get('/template',ctrlTemplates.searchTemplate);
router.get('/template-private',passport.authenticate('jwt', {session:false}), ctrlTemplates.searchPrivateTemplate);

module.exports = router;
