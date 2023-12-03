const express = require('express');
const { isLoggedIn } = require('../middlewares');
const {requestDelivery, createOrder, getDeliveryList, getDeliveryHistory,
    getDeliveryRequest, acceptDeliveryRequest, finishDelivery, getDeliveryStatus, getOrderByCustomerId,
    getFinishOrderByCustomerId
} = require('../controller/orders');

const router = express.Router();

// 주문 이력 조회 by customerId
router.get('/customer', isLoggedIn, getOrderByCustomerId);

// 완료된 주문 이력 조회
router.get('/customer/finish',isLoggedIn, getFinishOrderByCustomerId)

// 주문 이력 조회
router.get('/delivery/request', isLoggedIn, getDeliveryRequest)

// 주문 이력 조회 by deliver_personId
router.get('/delivery/history', isLoggedIn, getDeliveryHistory)

// 배달 상태 조회 - 각 주문에 대한 배달 상태 조회
router.get('/:orderId/delivery', isLoggedIn, getDeliveryStatus);

// 배달 리스트 조회 - 배달 기사 id를 통해 조회
router.get('/delivery', isLoggedIn, getDeliveryList)

// 배달 요청
router.post('/delivery', isLoggedIn, requestDelivery)

// 배달 수락
router.post('/delivery/accept', isLoggedIn, acceptDeliveryRequest)

// 주문 생성
router.post('/', isLoggedIn, createOrder);

// 배달 완료
router.post('/delivery/finish', isLoggedIn, finishDelivery)

module.exports = router;