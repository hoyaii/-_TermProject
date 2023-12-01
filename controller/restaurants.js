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

exports.getRestaurants = async (req, res, next) => {
    try {
        const [rows] = await pool.execute('SELECT restaurant_id AS restaurantId, name FROM Restaurant WHERE owner_id = ?', [req.user.id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.getReviewHistory = async (req, res, next) => {
    try {
        const restaurantId = req.params.restaurantId;
        const [orders] = await pool.execute('SELECT order_id, menu_id FROM Orders WHERE menu_id IN (SELECT menu_id FROM Menu WHERE restaurant_id = ?)', [restaurantId]);

        for (let order of orders) {
            const [menus] = await pool.execute('SELECT name FROM Menu WHERE menu_id = ?', [order.menu_id]);
            order.menu_name = menus[0].name;

            const [reviews] = await pool.execute('SELECT comment FROM Review WHERE order_id = ?', [order.order_id]);
            if (reviews.length > 0) {
                order.comment = reviews[0].comment;
            }
        }

        res.json(orders);
    } catch (err) {
        console.error(err);
        next(err);
    }
};