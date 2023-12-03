const { User, Order } = require('../models');
const db = require(process.cwd() + '/models');


exports.addDeliveryPersonInfo = async (req, res, next) => {
   // const userId = req.user.user_id; // 세션에서 사용자 ID를 가져옵니다.
    const { serviceArea, email } = req.body; // 요청 본문에서 서비스 지역을 가져옵니다.

    try {
        await db.query(
            "UPDATE User SET service_area = ?, status = 'free' WHERE email = ?",
            [serviceArea, email]
        );
        res.status(200).send('배달원 정보가 성공적으로 업데이트되었습니다.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('배달원 정보 업데이트에 실패하였습니다.');
        next(error);
    }
};

exports.getRole = async (req, res, next) => {
    const { email } = req.body;

    try {
        let [rows] = await db.query(
            "SELECT role FROM User WHERE email = ?",
            [email]
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