const index = require('passport');
const local = require('./localStrategy');
const User = require('../controller/user'); // 이를 적절한 데이터베이스 라이브러리로 교체해야 합니다.
const db = require('../models/index'); // 데이터베이스 연결 설정을 불러옵니다.

module.exports = () => {
    index.serializeUser((user, done) => {
        done(null, user.id);
    });

    index.deserializeUser((id, done) => {
        db.execute('SELECT * FROM users WHERE id = ?', [id]) // 'users' 테이블과 컬럼명을 실제 환경에 맞게 수정해야 합니다.
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