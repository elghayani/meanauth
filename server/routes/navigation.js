const express = require('express');
const router = express.Router();
const ctrlThoughts = require('../controllers/thoughts.controller');

router.post('/environnement', ctrlThoughts.getEnv);

module.exports = router;
