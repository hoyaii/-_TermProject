const { Restaurant, Menu } = require('../models');

exports.createRestaurant = async (req, res, next) => {
    const { name, address, cuisineType, serviceArea } = req.body;
    const userId = req.user.id; // Assuming the user's ID is stored in req.user.id
    const sql = "INSERT INTO Restaurant (name, address, cuisine_type, owner_id, service_area) VALUES (?, ?, ?, ?, ?)";

    try {
        const [result] = await pool.query(sql, [name, address, cuisineType, userId, serviceArea]);

        if (result.affectedRows > 0) {
            res.sendStatus(201); // Send 'Created' status if the insertion was successful
        } else {
            res.sendStatus(500); // Send 'Server Error' status if no rows were affected
        }
    } catch (err) {
        console.error(err);
        next(err);
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
    const restaurantId = req.params.restaurantId;
    const orderHistorySql = "SELECT order_id, status, menu_id, order_time FROM Orders WHERE menu_id IN (SELECT menu_id FROM Menu WHERE restaurant_id = ?)";
    const menuNameSql = "SELECT name FROM Menu WHERE menu_id = ?";

    try {
        const [orderHistoryResults] = await pool.query(orderHistorySql, [restaurantId]);
        const orderHistoryData = await Promise.all(orderHistoryResults.map(async order => {
            const [menuNameResults] = await pool.query(menuNameSql, [order.menu_id]);
            return {
                orderId: order.order_id,
                orderStatus: order.status,
                menuName: menuNameResults[0].name,
                orderTime: order.order_time,
            };
        }));

        res.json(orderHistoryData);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.updateRestaurant = async (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    const { name, address, cuisineType, serviceArea } = req.body;
    const sql = "UPDATE Restaurant SET name = ?, address = ?, cuisine_type = ?, service_area = ? WHERE restaurant_id = ?";

    try {
        const [affectedRows] = await pool.query(sql, [name, address, cuisineType, serviceArea, restaurantId]);

        if (affectedRows > 0) {
            res.sendStatus(200); // Send 'OK' status if the update was successful
        } else {
            res.sendStatus(404); // Send 'Not Found' status if no rows were affected (i.e., the restaurant does not exist)
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
};