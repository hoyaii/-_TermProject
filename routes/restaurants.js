const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { createRestaurant, getRestaurant, createMenu } = require('../controller/restaurants');

const router = express.Router();

// 음식점 등록
router.post('/', isLoggedIn, createRestaurant);

// 음식점 정보 조회
router.get('/:restaurantId', getRestaurant);

// 메뉴 등록
router.post('/:restaurantId/menus', isLoggedIn, createMenu);

module.exports = router;
