const { Review } = require('../models');
const db = require(process.cwd() + '/models');

// 리뷰를 생성하는 함수
exports.createReview = async (req, res, next) => {
    const { orderId, rating, comment } = req.body;
    const userId = req.user.user_id; // 세션에서 사용자 ID를 가져옴

    try {
        // 리뷰 정보를 DB에 저장
        const sql = "INSERT INTO Review (order_id, customer_id, rating, comment) VALUES (?, ?, ?, ?)";
        await db.query(sql, [orderId, userId, rating, comment]);

        res.status(200).send('리뷰가 성공적으로 작성되었습니다.');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// 리뷰를 가져오는 함수
exports.getReview = async (req, res, next) => {
    const restaurantId = req.params.restaurantId; // URL 경로에서 restaurantId를 가져옴

    try {
        // 식당 ID에 해당하는 주문의 주문 ID와 메뉴 ID를 가져옴
        let [orderRows] = await db.query("SELECT order_id, menu_id FROM Orders WHERE restaurant_id = ?", [restaurantId]);

        let reviewHistory = [];

        // 각 주문에 대한 정보를 추가합니다.
        for(let order of orderRows) {
            let [menuRows] = await db.query("SELECT name FROM Menu WHERE menu_id = ?", [order.menu_id]);
            let [reviewRows] = await db.query("SELECT comment FROM Review WHERE order_id = ?", [order.order_id]);

            // 메뉴와 리뷰가 존재하는 경우에만 리뷰 이력에 추가
            if (menuRows[0] && reviewRows[0]) {
                reviewHistory.push({
                    orderId: order.order_id,
                    menuName: menuRows[0].name,
                    comment: reviewRows[0].comment,
                });
            }
        }

        res.status(200).json(reviewHistory);
    } catch (err) {
        console.error(err);
        next(err);
    }
};