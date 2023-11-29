const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { createOrder, updateOrder, getDeliveryOrders } = require('../controller/orders');

const router = express.Router();

// 주문 생성
router.post('/', isLoggedIn, createOrder);

// 배달 상태 업데이트
router.put('/:orderId/delivery', isLoggedIn, updateOrder);

// 배달 이력 조회
router.get('/deliveryPersons/:deliveryPersonId/orders', isLoggedIn, getDeliveryOrders);

module.exports = router;