const express = require('express');
const router = express.Router();

const cntrlAuth = require('../controllers/auth.controller');
// Register
router.post('/register', cntrlAuth.signup);
// login
router.post('/login', cntrlAuth.login);
//logut
router.get('/logout', cntrlAuth.logout);

module.exports = router;