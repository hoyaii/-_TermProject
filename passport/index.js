const index = require('passport');
const local = require('./localStrategy');
const User = require('../controller/user'); // 이를 적절한 데이터베이스 라이브러리로 교체해야 합니다.
const db = require('../models/index'); // 데이터베이스 연결 설정을 불러옵니다.

module.exports = () => {
    index.serializeUser((user, done) => {
        done(null, user.user_id);  // user_id로 변경
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