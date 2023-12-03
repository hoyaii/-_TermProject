const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { createReview, getReview } = require('../controller/reviews');

const router = express.Router();

// 리뷰 작성
router.post('/', isLoggedIn, createReview);

// 리뷰 확인 by 식당 주인
router.get('restaurants/${restaurantId}', isLoggedIn, getReview)

module.exports = router;