const { Review } = require('../models');
const db = require(process.cwd() + '/models');

exports.createReview = async (req, res, next) => {
    const { orderId, rating, comment } = req.body;
    const userId = req.user.user_id; // 세션에서 사용자 ID를 가져옵니다.

    const sql = "INSERT INTO Review (order_id, customer_id, rating, comment) VALUES (?, ?, ?, ?)";

    try {
        await db.query(sql, [orderId, userId, rating, comment]);

        res.status(200).send('리뷰가 성공적으로 작성되었습니다.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('리뷰 작성에 실패하였습니다.');
        next(error);
    }
};

exports.getReview = async (req, res, next) => {
    const restaurantId = req.params.restaurantId; // URL 경로에서 restaurantId를 가져옵니다.

    try {
        // restaurant_id에 해당하는 주문의 order_id와 menu_id를 가져옵니다.
        let [orderRows] = await db.query("SELECT order_id, menu_id FROM Orders WHERE restaurant_id = ?", [restaurantId]);

        let reviewHistory = [];

        // 각 주문에 대한 정보를 추가합니다.
        for(let order of orderRows) {
            let [menuRows] = await db.query("SELECT name FROM Menu WHERE menu_id = ?", [order.menu_id]);
            let [reviewRows] = await db.query("SELECT comment FROM Review WHERE order_id = ?", [order.order_id]);

            if (menuRows[0] && reviewRows[0]) { // menuRows[0]과 reviewRows[0]이 존재하는지 확인합니다.
                reviewHistory.push({
                    orderId: order.order_id,
                    menuName: menuRows[0].name,
                    comment: reviewRows[0].comment,
                });
            }
        }

        res.status(200).json(reviewHistory);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('리뷰 조회에 실패하였습니다.');
        next(error);
    }
};