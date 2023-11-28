const { Restaurant, Menu } = require('../models');

exports.createRestaurant = async (req, res, next) => {
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
};

exports.getRestaurant = async (req, res, next) => {
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
};

exports.createMenu = async (req, res, next) => {
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
};