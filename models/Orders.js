const Sequelize = require('sequelize');

module.exports = class Orders extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            order_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            delivery_id: {
                type: Sequelize.INTEGER,
            },
            restaurant_id: {
                type: Sequelize.INTEGER,
            },
            menu_id: {
                type: Sequelize.INTEGER,
            },
            customer_id: {
                type: Sequelize.INTEGER,
            },
            status: {
                type: Sequelize.STRING(255),
            },
            order_time: {
                type: Sequelize.DATE,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Orders',
            tableName: 'orders',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Orders.belongsTo(db.User, { foreignKey: 'customer_id', targetKey: 'user_id' });
        db.Orders.belongsTo(db.Menu, { foreignKey: 'menu_id', targetKey: 'menu_id' });
        db.Orders.belongsTo(db.Restaurant, { foreignKey: 'restaurant_id', targetKey: 'restaurant_id' });
        db.Orders.belongsTo(db.Delivery, { foreignKey: 'delivery_id', targetKey: 'delivery_id' });
    }
};
