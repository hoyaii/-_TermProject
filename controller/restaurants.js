const { } = require('../models');

exports.createRestaurant = async (req, res, next) => {
    const { name, address, cuisineType, serviceArea } = req.body;
    const userId = req.user.id;
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

exports.getRestaurantByOwnerId = async (req, res, next) => {
    try {
        const [rows] = await pool.execute('SELECT restaurant_id AS restaurantId, name FROM Restaurant WHERE owner_id = ?', [req.user.id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.getRestaurant = async (req, res, next) => {
    const { name, serviceArea, cuisineType } = req.query;  // Get the parameters from the query string
    const sql = "SELECT restaurant_id, name, service_area, cuisine_type FROM Restaurant WHERE name LIKE ? AND service_area LIKE ? AND cuisine_type LIKE ?";

    try {
        const [restaurantData] = await pool.query(sql, [`%${name}%`, `%${serviceArea}%`, `%${cuisineType}%`]);
        res.json(restaurantData);
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

exports.createMenu = async (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    const { name, price } = req.body;
    const sql = "INSERT INTO Menu (name, price, restaurant_id) VALUES (?, ?, ?)";
    try {
        await pool.query(sql, [name, price, restaurantId]);
        res.status(201).send('Menu created successfully');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.getMenu = async (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    const sql = "SELECT menu_id, name, price FROM Menu WHERE restaurant_id = ?";
    try {
        const [menuData] = await pool.query(sql, [restaurantId]);
        res.json(menuData);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.updateMenu = async (req, res, next) => {
    const menuId = req.params.menuId;
    const { name, price } = req.body;
    const sql = "UPDATE Menu SET name = ?, price = ? WHERE menu_id = ?";
    try {
        await pool.query(sql, [name, price, menuId]);
        res.send('Menu updated successfully');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.deleteMenu = async (req, res, next) => {
    const menuId = req.params.menuId;
    const sql = "DELETE FROM Menu WHERE menu_id = ?";
    try {
        await pool.query(sql, [menuId]);
        res.send('Menu deleted successfully');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.getOrderMatchedByRestaurantId = async (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    const orderHistorySql = "SELECT order_id, status, menu_id, order_time FROM Orders WHERE restaurant_id = ? AND status = 'deliveryMatched'";
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

exports.getOrderByRestaurantId = async (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    const orderHistorySql = "SELECT order_id, status, menu_id, order_time FROM Orders WHERE restaurant_id = ?";
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

exports.updateOrderFinish = async (req, res, next) => {
    const orderId = req.params.orderId;
    const sql = "UPDATE Orders SET status = 'cooked' WHERE order_id = ?";
    try {
        const [result] = await pool.query(sql, [orderId]);
        if (result.affectedRows > 0) {
            res.send('주문 처리가 완료되었습니다.');
        } else {
            res.send('주문 처리가 실패하였습니다.');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
};