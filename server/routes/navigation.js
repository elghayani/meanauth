const express = require('express');
const router = express.Router();
const ctrlThoughts = require('../controllers/thoughts.controller');

router.get('/env', ctrlThoughts.getEnv);

module.exports = router;
