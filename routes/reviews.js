const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { createReview, getReview } = require('../controller/reviews');

const router = express.Router();

// 리뷰 작성
router.post('/', isLoggedIn, createReview);

module.exports = router;