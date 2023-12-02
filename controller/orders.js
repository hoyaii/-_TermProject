const {  } = require('../models');
const db = require(process.cwd() + '/models');

exports.createOrder = async (req, res, next) => {
    const { deliveryId, restaurantId, menuId } = req.body;
    const userId = req.session.userId; // 세션에서 사용자 ID를 가져옵니다.

    const sql = "INSERT INTO Orders (delivery_id, restaurant_id, menu_id, customer_id, status, order_time) VALUES (?, ?, ?, ?, ?, ?)";

    try {
        // order_time 구하기
        const currentTime = new Date();

        await db.query(sql, [deliveryId, restaurantId, menuId, userId, 'notMatched', currentTime]);

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
        const [orderResults] = await db.query(orderSql, [customerId]);
        const orderData = await Promise.all(orderResults.map(async order => {
            const [menuResults] = await db.query(menuSql, [order.order_id]);
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
        let [rows] = await db.query("SELECT delivery_id, restaurant_id, delivery_address FROM Delivery WHERE delivery_person_id = ? AND status = ?", [userId, "accepted"]);

        // 각 배달에 대한 restaurantAddress를 추가한다
        for (let i = 0; i < rows.length; i++) {
            const restaurantId = rows[i].restaurant_id;
            let [restaurantRows] = await db.query("SELECT address FROM Restaurant WHERE restaurant_id = ?", [restaurantId]);
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

exports.requestDelivery = async (req, res, next) => {
    const userId = req.session.userId; // 세션에서 사용자 ID를 가져옵니다.
    const restaurantId = req.body.restaurantId; // 요청 본문에서 식당 ID를 가져옵니다.

    try {
        // 사용자의 주소를 가져옵니다.
        const userAddress = await db.query("SELECT address FROM User WHERE user_id = ?", [userId]);

        // 식당의 서비스 지역을 가져옵니다.
        const serviceAreaResult = await db.query("SELECT service_area FROM Restaurant WHERE restaurant_id = ?", [restaurantId]);
        const serviceArea = serviceAreaResult[0].service_area;

        // 서비스 지역에서 현재 사용 가능한 배달원을 모두 가져옵니다.
        const availableDeliveryPersons = await db.query("SELECT user_id FROM User WHERE service_area = ? AND status = 'free'", [serviceArea]);

        if (availableDeliveryPersons.length === 0) {
            console.log("배달 가능한 배달원이 존재하지 않습니다.");
            return;
        }

        // 가능한 배달원 중에서 무작위로 한 명을 선택합니다.
        const randomIndex = Math.floor(Math.random() * availableDeliveryPersons.length);
        const selectedDeliveryPersonId = availableDeliveryPersons[randomIndex].user_id;

        // 새로운 배달 요청을 생성합니다.
        await db.query(
            "INSERT INTO Delivery (restaurant_id, delivery_address, delivery_person_id, status) VALUES (?, ?, ?, 'notAccepted')",
            [restaurantId, userAddress[0].address, selectedDeliveryPersonId]
        );

        // 새로 생성된 배달 요청의 ID를 가져옵니다.
        const deliveryId = await db.query("SELECT LAST_INSERT_ID() as delivery_id");

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
        let [rows] = await db.query("SELECT order_id FROM Orders WHERE delivery_id = ? AND status = ?", [deliveryId, "cooked"]);
        if (rows.length === 0) {
            return res.status(404).send('해당 배달 ID에 대한 주문이 없습니다.');
        }
        const orderId = rows[0].order_id;

        // 배달 상태를 업데이트한다
        [rows] = await db.query("UPDATE Delivery SET status = ? WHERE delivery_id = ?", ["finished", deliveryId]);

        // 주문 상태를 업데이트한다
        [rows] = await db.query("UPDATE Orders SET status = ? WHERE order_id = ?", ["finished", orderId]);

        // 유저 정보를 업데이트한다
        [rows] = await db.query("UPDATE User SET status = ? WHERE user_id = ?", ["free", userId]);

        res.status(200).send('배달 및 주문 상태가 성공적으로 업데이트되었습니다.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('배달 및 주문 상태 업데이트에 실패하였습니다.');
        next(error);
    }
};

exports.getDeliveryHistory = async (req, res, next) => {
    const userId = req.session.userId; // 세션에서 사용자 ID를 가져옵니다.

    try {
        // delivery_id 리스트를 구한다
        let [deliveryRows] = await db.query("SELECT delivery_id FROM Delivery WHERE delivery_person_id = ? AND status = 'finished'", [userId]);
        let deliveryIdListSize = deliveryRows.length; // delivery_id 리스트의 크기를 구한다

        let deliveryHistory = [];

        // 각 delivery_id에 대한 정보를 추가한다
        for (let i = 0; i < deliveryRows.length; i++) {
            const deliveryId = deliveryRows[i].delivery_id;
            let [orderRows] = await db.query("SELECT order_id, menu_id, restaurant_id, order_time FROM Orders WHERE delivery_id = ? AND status = 'finished'", [deliveryId]);

            for (let order of orderRows) {
                let [menuRows] = await db.query("SELECT name FROM Menu WHERE menu_id = ?", [order.menu_id]);
                let [restaurantRows] = await db.query("SELECT name FROM Restaurant WHERE restaurant_id = ?", [order.restaurant_id]);
                let [deliveryAddressRows] = await db.query("SELECT delivery_address FROM Delivery WHERE delivery_id = (SELECT delivery_id FROM Orders WHERE order_id = ?)", [order.order_id]);

                // 주문 시간을 원하는 형식으로 포맷한다
                let formattedOrderTime = formatDate(order.order_time);

                deliveryHistory.push({
                    orderId: order.order_id,
                    restaurantName: restaurantRows[0].name,
                    menuName: menuRows[0].name,
                    formattedOrderTime,
                    deliveryAddress: deliveryAddressRows[0].delivery_address,
                });
            }
        }

        res.status(200).json({ deliveryHistory, deliveryIdListSize });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('배달 기록 조회에 실패하였습니다.');
        next(error);
    }
};

exports.getDeliveryRequest = async (req, res, next) => {
    const userId = req.session.userId; // 세션에서 사용자 ID를 가져옵니다.

    try {
        let [rows] = await db.query(
            "SELECT delivery_id, restaurant_id, delivery_address FROM Delivery WHERE delivery_person_id = ? AND status = 'notAccepted'",
            [userId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('배달 요청 조회에 실패하였습니다.');
        next(error);
    }
};

exports.acceptDeliveryRequest = async (req, res, next) => {
    const userId = req.session.userId; // 세션에서 사용자 ID를 가져옵니다.
    const { deliveryId } = req.body; // 요청 본문에서 배달 ID를 가져옵니다.

    try {
        const [orderIds] = await db.query(
            "SELECT order_id FROM Orders WHERE delivery_id = ? AND status = 'notMatched'",
            [deliveryId]
        );

        if (orderIds.length > 0) {
            const orderId = orderIds[0].order_id;

            await db.query(
                "UPDATE Delivery SET status = 'accepted' WHERE delivery_id = ?",
                [deliveryId]
            );
            await db.query(
                "UPDATE Orders SET status = 'deliveryMatched' WHERE order_id = ?",
                [orderId]
            );
            await db.query(
                "UPDATE User SET status = 'notFree' WHERE user_id = ?",
                [userId]
            );

            res.status(200).send('배달 요청이 성공적으로 수락되었습니다.');
        } else {
            res.status(400).send('배달 요청을 수락할 수 없습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('배달 요청 수락에 실패하였습니다.');
        next(error);
    }
};

function formatDate(date) {
    // 여기서 date를 원하는 형식의 문자열로 변환한다
    // 예를 들어, yyyy-mm-dd 형식으로 변환하려면 다음과 같이 한다:
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고, 2자리로 만든다
    let day = String(date.getDate()).padStart(2, '0'); // 일자를 2자리로 만든다
    return `${year}-${month}-${day}`;
}