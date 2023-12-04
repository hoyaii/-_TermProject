const express = require('express');
const { isLoggedIn } = require('../middlewares');
const {createOrder, getDeliveryStatus, getOrderByCustomerId, getFinishOrderByCustomerId
} = require('../controller/orders');

const router = express.Router();

// 주문 생성
router.post('/', isLoggedIn, createOrder);

// 주문 이력 조회
router.get('/customer', isLoggedIn, getOrderByCustomerId);

// 완료된 주문 이력 조회
router.get('/customer/finish',isLoggedIn, getFinishOrderByCustomerId)

// 배달 상태 조회 - 각 주문에 대한 배달 상태 조회
router.get('/:orderId/delivery', isLoggedIn, getDeliveryStatus);

module.exports = router;