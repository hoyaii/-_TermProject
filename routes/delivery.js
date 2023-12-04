const express = require('express');
const { isLoggedIn } = require('../middlewares');
const {getDeliveryRequestByUserId, getDeliveryHistoryByUserId, acceptDeliveryRequest, finishDelivery, getDeliveryListByUserId, requestDelivery} = require('../controller/delivery');

const router = express.Router();

// 배달 요청
router.post('/', isLoggedIn, requestDelivery)

// 배달 리스트 조회 - 배달 기사 id를 통해 조회
router.get('/', isLoggedIn, getDeliveryListByUserId)

// 배달 수락
router.post('/accept', isLoggedIn, acceptDeliveryRequest)

// 배달 완료
router.post('/finish', isLoggedIn, finishDelivery)

// 배달 요청 목록 조회
router.get('/request', isLoggedIn, getDeliveryRequestByUserId)

// 주문 이력 조회
router.get('/history', isLoggedIn, getDeliveryHistoryByUserId)


module.exports = router;