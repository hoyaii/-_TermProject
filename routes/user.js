const express = require('express');
const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.find({ where: { id: req.user.id } });
        if (!user) {
        return res.status(404).send('No user found.');
    }
    res.json(user);
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;