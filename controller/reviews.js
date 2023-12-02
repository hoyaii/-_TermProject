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
