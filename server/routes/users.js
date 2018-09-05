var express = require('express');
var router = express.Router();
const ctrlUsers = require('../controllers/users.controller');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Profile
router.get('/profile', ctrlUsers.profileRead);

module.exports = router;
