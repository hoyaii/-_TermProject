const passport = require('passport');
const local = require('./localStrategy'); // 수정 필요
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.find({ where: { id } })
        .then(user => done(null, user))
        .catch(err => done(err));
    });

    local();
};