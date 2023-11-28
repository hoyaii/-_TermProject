const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { Restaurant, Menu } = require('../models');

const router = express.Router();

// 음식점 등록
router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const newRestaurant = await Restaurant.create({
            name: req.body.name,
            ownerId: req.user.id,
        });
        res.json(newRestaurant);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 음식점 정보 조회
router.get('/:restaurantId', async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findOne({
            where: { id: req.params.restaurantId },
        });
        if (!restaurant) {
            return res.status(404).send('Restaurant not found');
        }
        res.json(restaurant);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 메뉴 등록
router.post('/:restaurantId/menus', isLoggedIn, async (req, res, next) => {
    try {
        const newMenu = await Menu.create({
            name: req.body.name,
            price: req.body.price,
            restaurantId: req.params.restaurantId,
        });
        res.json(newMenu);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;

