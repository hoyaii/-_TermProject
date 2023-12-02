const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { getOrderByCustomerId, requestDeliveryService, createOrder} = require('../controller/orders');

const router = express.Router();

// 주문 이력 조회 by customerId
router.get('/customer', isLoggedIn, getOrderByCustomerId);

// 배달 상태 조회
router.get('/:orderId/delivery', isLoggedIn, getOrderByCustomerId);

// 배달 요청
router.post('/delivery', isLoggedIn, requestDeliveryService)

// 주문 생성
router.post('/', isLoggedIn, createOrder);

module.exports = router;