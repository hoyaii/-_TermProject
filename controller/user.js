const { User, Order } = require('../models');

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.userId },
        });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.update({
            email: req.body.email,
            name: req.body.name,
        }, {
            where: { id: req.params.userId },
        });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const result = await User.destroy({
            where: { id: req.params.userId },
        });
        if (!result) {
            return res.status(404).send('User not found');
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        next(error);
    }
};

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
