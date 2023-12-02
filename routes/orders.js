const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { getOrderByCustomerId} = require('../controller/orders');

const router = express.Router();

// 주문 이력 조회 by customerId
router.get('/customer', isLoggedIn, getOrderByCustomerId);

// 배달 상태 조회
router.get('/:orderId/delivery', isLoggedIn, getOrderByCustomerId);

module.exports = router;