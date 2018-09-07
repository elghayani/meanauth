const express = require('express'),
 router = express.Router(),
 passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.use('/users', passport.authenticate('jwt', {session:false}), require('./users'));
router.use('/auth', require('./auth'));
router.use('/api/search', require('./search'));
router.use('/api/imageBank', require('./imageBank'));

module.exports = router;
