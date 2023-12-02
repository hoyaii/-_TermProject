const {  } = require('../models');

exports.createOrder = async (req, res, next) => {
    const { deliveryId, restaurantId, menuId } = req.body;
    const userId = req.session.userId; // 세션에서 사용자 ID를 가져옵니다.

    const sql = "INSERT INTO Orders (delivery_id, restaurant_id, menu_id, customer_id, status, order_time) VALUES (?, ?, ?, ?, ?, ?)";

    try {
        // order_time 구하기
        const currentTime = new Date();

        await connection.query(sql, [deliveryId, restaurantId, menuId, userId, 'notMatched', currentTime]);

        res.status(200).send('Order created successfully');
    } catch (error) {
        console.error('Error:', error);
        next(error);
    }
};

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

exports.getDeliveryList = async (req, res, next) => {
    const userId = req.session.userId; // 세션에서 사용자 ID를 가져옵니다.

    try {
        // delivery_id, restaurant_id, delivery_address를 구한다
        let [rows] = await connection.query("SELECT delivery_id, restaurant_id, delivery_address FROM Delivery WHERE delivery_person_id = ? AND status = ?", [userId, "accepted"]);

        // 각 배달에 대한 restaurantAddress를 추가한다
        for (let i = 0; i < rows.length; i++) {
            const restaurantId = rows[i].restaurant_id;
            let [restaurantRows] = await connection.query("SELECT address FROM Restaurant WHERE restaurant_id = ?", [restaurantId]);
            rows[i].restaurantAddress = restaurantRows[0].address;
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('배달 목록 조회에 실패하였습니다.');
        next(error);
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

exports.requestDelivery = async (req, res, next) => {
    const userId = req.session.userId; // 세션에서 사용자 ID를 가져옵니다.
    const restaurantId = req.body.restaurantId; // 요청 본문에서 식당 ID를 가져옵니다.

    try {
        // 사용자의 주소를 가져옵니다.
        const userAddress = await connection.query("SELECT address FROM User WHERE user_id = ?", [userId]);

        // 식당의 서비스 지역을 가져옵니다.
        const serviceAreaResult = await connection.query("SELECT service_area FROM Restaurant WHERE restaurant_id = ?", [restaurantId]);
        const serviceArea = serviceAreaResult[0].service_area;

        // 서비스 지역에서 현재 사용 가능한 배달원을 모두 가져옵니다.
        const availableDeliveryPersons = await connection.query("SELECT user_id FROM User WHERE service_area = ? AND status = 'free'", [serviceArea]);

        if (availableDeliveryPersons.length === 0) {
            console.log("배달 가능한 배달원이 존재하지 않습니다.");
            return;
        }

        // 가능한 배달원 중에서 무작위로 한 명을 선택합니다.
        const randomIndex = Math.floor(Math.random() * availableDeliveryPersons.length);
        const selectedDeliveryPersonId = availableDeliveryPersons[randomIndex].user_id;

        // 새로운 배달 요청을 생성합니다.
        await connection.query(
            "INSERT INTO Delivery (restaurant_id, delivery_address, delivery_person_id, status) VALUES (?, ?, ?, 'notAccepted')",
            [restaurantId, userAddress[0].address, selectedDeliveryPersonId]
        );

        // 새로 생성된 배달 요청의 ID를 가져옵니다.
        const deliveryId = await connection.query("SELECT LAST_INSERT_ID() as delivery_id");

        res.status(200).json({ deliveryId: deliveryId[0].delivery_id });
    } catch (error) {
        console.error('Error:', error);
        next(error);
    }
};

exports.finishDelivery = async (req, res, next) => {
    const deliveryId = req.body.deliveryId;
    const userId = req.session.userId; // 세션에서 사용자 ID를 가져옵니다.

    try {
        // deliveryId를 가지고 orderId를 구한다
        let [rows] = await connection.query("SELECT order_id FROM Orders WHERE delivery_id = ? AND status = ?", [deliveryId, "cooked"]);
        if (rows.length === 0) {
            return res.status(404).send('해당 배달 ID에 대한 주문이 없습니다.');
        }
        const orderId = rows[0].order_id;

        // 배달 상태를 업데이트한다
        [rows] = await connection.query("UPDATE Delivery SET status = ? WHERE delivery_id = ?", ["finished", deliveryId]);

        // 주문 상태를 업데이트한다
        [rows] = await connection.query("UPDATE Orders SET status = ? WHERE order_id = ?", ["finished", orderId]);

        // 유저 정보를 업데이트한다
        [rows] = await connection.query("UPDATE User SET status = ? WHERE user_id = ?", ["free", userId]);

        res.status(200).send('배달 및 주문 상태가 성공적으로 업데이트되었습니다.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('배달 및 주문 상태 업데이트에 실패하였습니다.');
        next(error);
    }
};
