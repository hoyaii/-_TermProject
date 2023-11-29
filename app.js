const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config(); // 환경 변수를 로드합니다.
const authRouter = require('./routes/auth'); // 인증 관련 라우터
const userRouter = require('./routes/user'); // 사용자 관련 라우터
const restaurantRouter = require('./routes/restaurants'); // 음식점 관련 라우터
const orderRouter = require('./routes/orders'); // 주문 관련 라우터
const reviewRouter = require('./routes/reviews'); // 리뷰 관련 라우터

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

// 미들웨어 설정
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

app.use(passport.initialize()); // 체크
app.use(passport.session()); // 체크

// 라우팅 설정
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/restaurants', restaurantRouter);
app.use('/orders', orderRouter);
app.use('/reviews', reviewRouter);

// 404 에러 처리
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

module.exports = app;