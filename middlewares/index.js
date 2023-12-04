exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // 사용자가 로그인 상태인지 확인함.
        next(); // 로그인 상태라면 다음 미들웨어로 넘어간다.
    } else {
        res.status(403).send('로그인 필요'); // 로그인 상태가 아니라면 403 에러를 반환
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next(); // 로그인 상태가 아니라면 다음 미들웨어로 넘어감.
    } else {
        res.status(403).json({ error: '로그인한 상태입니다.' });
    }
};
