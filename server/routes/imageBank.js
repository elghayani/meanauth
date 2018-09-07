const express = require('express');
const router = express.Router();
const ctrlThoughts = require('../controllers/thoughts.controller');

router.get('/list', ctrlThoughts.getImages);

module.exports = router;
