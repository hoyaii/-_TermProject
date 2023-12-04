const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { addDeliveryPersonInfo, getRole, getName} = require('../controller/user');

const router = express.Router();

// 유저 역할
router.post('/role', getRole)

// 유저 이름
router.get('/name', isLoggedIn, getName)

// 배달원 추가 정보 입력
router.patch('/deliveryPerson', addDeliveryPersonInfo)

module.exports = router;