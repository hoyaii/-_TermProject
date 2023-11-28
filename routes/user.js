const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { getUser, updateUser, deleteUser } = require('../controller/user');

const router = express.Router();

// 사용자 정보 조회
router.get('/:userId', isLoggedIn, getUser);

// 사용자 정보 수정
router.put('/:userId', isLoggedIn, updateUser);

// 사용자 계정 삭제
router.delete('/:userId', isLoggedIn, deleteUser);

module.exports = router;

