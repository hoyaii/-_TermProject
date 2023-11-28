const { Order, DeliveryPerson } = require('../models');

exports.createOrder = async (req, res, next) => {
    try {
        const newOrder = await Order.create({
            userId: req.user.id,
            restaurantId: req.body.restaurantId,
            menuId: req.body.menuId,
        });
        res.json(newOrder);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.updateOrder = async (req, res, next) => {
    try {
        const updatedOrder = await Order.update({
            deliveryStatus: req.body.deliveryStatus,
        }, {
            where: { id: req.params.orderId },
        });
        if (!updatedOrder) {
            return res.status(404).send('Order not found');
        }
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.getDeliveryOrders = async (req, res, next) => {
    try {
        const deliveryPerson = await DeliveryPerson.findOne({
            where: { id: req.params.deliveryPersonId },
        });
        if (!deliveryPerson) {
            return res.status(404).send('Delivery person not found');
        }
        const orders = await Order.findAll({
            where: { deliveryPersonId: req.params.deliveryPersonId },
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        next(error);
    }
};
