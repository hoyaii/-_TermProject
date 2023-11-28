const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { createReview, getReview } = require('../controllers/review');

const router = express.Router();

// 리뷰 작성
router.post('/', isLoggedIn, createReview);

// 리뷰 조회
router.get('/:reviewId', getReview);

module.exports = router;
