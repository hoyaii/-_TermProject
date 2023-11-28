const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.signup = async (req, res, next) => {
    const { email, name, password } = req.body;
    try {
        const exUser = await User.find({ where: { email } });
        if (exUser) {
            req.flash('signupError', '이미 존재하는 이메일입니다.');
            return res.redirect('/signup');
        }

        const hash = await bcrypt.hash(password, 12);

        await User.create({
            email,
            name,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }

        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }

        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
};
