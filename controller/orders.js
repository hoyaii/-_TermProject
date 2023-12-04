const {  } = require('../models');
const db = require(process.cwd() + '/models');

// 주문을 생성하는 함수
exports.createOrder = async (req, res, next) => {
    const { deliveryId, restaurantId, menuId } = req.body;
    const userId = req.user.user_id; // 세션에서 사용자 ID를 가져옵니다.

    const sql = "INSERT INTO Orders (delivery_id, restaurant_id, menu_id, customer_id, status, order_time) VALUES (?, ?, ?, ?, ?, ?)";

    try {
        // 현재 시간을 주문 시간으로 설정하고 주문 정보를 DB에 저장
        const currentTime = new Date(); // order_time 구하기

        await db.query(sql, [deliveryId, restaurantId, menuId, userId, 'notMatched', currentTime]);

        res.status(200).send('Order created successfully');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// 고객 ID로 주문을 가져오는 함수
exports.getOrderByCustomerId = async (req, res, next) => {
    const customerId = req.user.user_id;
    const orderSql = "SELECT order_id, order_time FROM Orders WHERE customer_id = ?";
    const menuSql = "SELECT m.name FROM Orders o JOIN Menu m ON o.menu_id = m.menu_id WHERE o.order_id = ?";

    try {
        // 주문 정보와 메뉴 이름을 가져옴
        const [orderResults] = await db.query(orderSql, [customerId]);
        const orderData = await Promise.all(orderResults.map(async order => {
            const [menuResults] = await db.query(menuSql, [order.order_id]);
            let formattedOrderTime = formatDate(order.order_time);

            return {
                orderId: order.order_id,
                menuName: menuResults[0] ? menuResults[0].name : null,
                orderTime: formattedOrderTime,
            };
        }));

        res.json(orderData);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// 고객 ID로 완료된 주문을 가져오는 함수
exports.getFinishOrderByCustomerId = async (req, res, next) => {
    const customerId = req.user.user_id;
    const orderSql = "SELECT order_id, order_time FROM Orders WHERE customer_id = ? AND status = 'finished'";
    const menuSql = "SELECT m.name FROM Orders o JOIN Menu m ON o.menu_id = m.menu_id WHERE o.order_id = ?";

    try {
        // 완료된 주문 정보와 메뉴 이름을 가져옴
        const [orderResults] = await db.query(orderSql, [customerId]);
        const orderData = await Promise.all(orderResults.map(async order => {
            const [menuResults] = await db.query(menuSql, [order.order_id]);
            let formattedOrderTime = formatDate(order.order_time);

            return {
                orderId: order.order_id,
                menuName: menuResults[0] ? menuResults[0].name : null,
                orderTime: formattedOrderTime,
            };
        }));

        res.json(orderData);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// 배달 상태를 가져오는 함수
exports.getDeliveryStatus = async (req, res, next) => {
    const orderId = req.params.orderId;
    const sql = "SELECT status FROM Orders WHERE order_id = ?";

    try {
        // 주문 ID로 배달 상태를 가져옴
        const [results] = await db.query(sql, [orderId]);
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

// 날짜를 원하는 형식으로 포맷하는 함수
function formatDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}