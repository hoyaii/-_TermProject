const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { Order, DeliveryPerson } = require('../models');

const router = express.Router();

// 주문 생성
router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const newOrder = await Order.create({
            userId: req.user.id,
            restaurantId: req.body.restaurantId,
            menuId: req.body.menuId,
        });
        res.json(newOrder);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 배달 상태 업데이트
router.put('/:orderId/delivery', isLoggedIn, async (req, res, next) => {
    try {
        const updatedOrder = await Order.update({
            deliveryStatus: req.body.deliveryStatus,
        }, {
            where: { id: req.params.orderId },
        });
        if (!updatedOrder) {
            return res.status(404).send('Order not found');
        }
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 배달 이력 조회
router.get('/deliveryPersons/:deliveryPersonId/orders', isLoggedIn, async (req, res, next) => {
    try {
        const deliveryPerson = await DeliveryPerson.findOne({
            where: { id: req.params.deliveryPersonId },
        });
        if (!deliveryPerson) {
            return res.status(404).send('Delivery person not found');
        }
        const orders = await Order.findAll({
            where: { deliveryPersonId: req.params.deliveryPersonId },
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
