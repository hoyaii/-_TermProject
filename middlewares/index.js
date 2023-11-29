exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // req.isAuthenticated()는 passport에서 제공하는 함수로, 사용자가 로그인 상태인지 확인합니다.
        next(); // 로그인 상태라면 다음 미들웨어로 넘어갑니다.
    } else {
        res.status(403).send('로그인 필요'); // 로그인 상태가 아니라면 403 에러를 반환합니다.
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { // req.isAuthenticated()는 passport에서 제공하는 함수로, 사용자가 로그인 상태인지 확인합니다.
        next(); // 로그인 상태가 아니라면 다음 미들웨어로 넘어갑니다.
    } else {
        const error = new Error('로그인한 상태입니다.');
        error.status = 403;
        next(error); // 로그인 상태라면 403 에러를 반환합니다.
    }
};
