const {  } = require('../models');

exports.getOrderByCustomerId = async (req, res, next) => {
    const customerId = req.user.id;  // 수정된 부분
    const orderSql = "SELECT order_id, order_time FROM Orders WHERE customer_id = ?";
    const menuSql = "SELECT m.name FROM Orders o JOIN Menu m ON o.menu_id = m.menu_id WHERE o.order_id = ?";

    try {
        const [orderResults] = await pool.query(orderSql, [customerId]);
        const orderData = await Promise.all(orderResults.map(async order => {
            const [menuResults] = await pool.query(menuSql, [order.order_id]);
            return {
                orderId: order.order_id,
                menuName: menuResults[0] ? menuResults[0].name : null,
                orderTime: order.order_time,
            };
        }));

        res.json(orderData);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.getDeliveryStatus = async (req, res, next) => {
    const orderId = req.params.orderId;
    const sql = "SELECT status FROM Orders WHERE order_id = ?";

    try {
        const [results] = await pool.query(sql, [orderId]);
        if (results.length > 0) {
            res.send(results[0].status);
        } else {
            res.send('해당하는 주문이 없습니다.');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
};
