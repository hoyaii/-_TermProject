const index = require('passport');
const local = require('./localStrategy');
const User = require('../controller/user');
const db = require('../models/index');

module.exports = () => {
    index.serializeUser((user, done) => {
        done(null, user.user_id); // user_id를 세션에 저장하고 사용합니다.
    });

    index.deserializeUser((user_id, done) => {
        db.execute('SELECT user_id, email FROM User WHERE user_id = ?', [user_id])
            .then(([rows, fields]) => {
                if (rows.length > 0) {
                    done(null, rows[0]);
                } else {
                    done(new Error('No matching user found.'));
                }
            })
            .catch(err => done(err));
    });

    local(index);
};