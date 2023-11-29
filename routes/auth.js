const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { signup, login, logout } = require('../controller/auth');

const router = express.Router();

router.post('/signup', isNotLoggedIn, signup);
router.post('/login', isNotLoggedIn, login);
router.get('/logout', isLoggedIn, logout);

module.exports = router;
