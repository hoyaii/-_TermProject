const { User, Order } = require('../models');


exports.addDeliveryPersonInfo = async (req, res, next) => {
    const userId = req.session.userId; // 세션에서 사용자 ID를 가져옵니다.
    const { serviceArea } = req.body; // 요청 본문에서 서비스 지역을 가져옵니다.

    try {
        await connection.query(
            "UPDATE User SET service_area = ?, status = 'free' WHERE user_id = ?",
            [serviceArea, userId]
        );
        res.status(200).send('배달원 정보가 성공적으로 업데이트되었습니다.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('배달원 정보 업데이트에 실패하였습니다.');
        next(error);
    }
};

exports.getRole = async (req, res, next) => {
    const userId = req.session.userId; // 세션에서 사용자 ID를 가져옵니다.

    try {
        let [rows] = await connection.query(
            "SELECT role FROM User WHERE user_id = ?",
            [userId]
        );
        if (rows.length > 0) {
            res.status(200).json({ role: rows[0].role });
        } else {
            res.status(400).send('사용자 역할을 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('사용자 역할 조회에 실패하였습니다.');
        next(error);
    }
};