const express = require('express');
const router = express.Router();
const ctrlThoughts = require('../controllers/thoughts.controller');

router.get('/environnement', ctrlThoughts.getEnv);

module.exports = router;
