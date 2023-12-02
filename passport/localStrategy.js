const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../models/index'); // 데이터베이스 연결 설정을 불러옵니다.

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const [rows, fields] = await db.execute('SELECT * FROM User WHERE email = ?', [email]); 

            if (rows.length > 0) {
                const exUser = rows[0];
                const result = await bcrypt.compare(password, exUser.password);

                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};