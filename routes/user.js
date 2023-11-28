const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { User, Order } = require('../models');

const router = express.Router();

// 사용자 정보 조회
router.get('/:userId', isLoggedIn, async (req, res, next) => {
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
});

// 사용자 정보 수정
router.put('/:userId', isLoggedIn, async (req, res, next) => {
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
});

// 사용자 계정 삭제
router.delete('/:userId', isLoggedIn, async (req, res, next) => {
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
});

module.exports = router;
