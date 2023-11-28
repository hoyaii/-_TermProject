const Sequelize = require('sequelize');

module.exports = class Delivery extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            delivery_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            delivery_person_id: {
                type: Sequelize.INTEGER,
            },
            restaurant_id: {
                type: Sequelize.INTEGER,
            },
            delivery_address: {
                type: Sequelize.STRING(255),
            },
            status: {
                type: Sequelize.STRING(50),
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Delivery',
            tableName: 'deliveries',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Delivery.belongsTo(db.User, { foreignKey: 'delivery_person_id', targetKey: 'user_id' });
        db.Delivery.hasOne(db.Orders, { foreignKey: 'delivery_id', sourceKey: 'delivery_id' });
        db.Delivery.belongsTo(db.Restaurant, { foreignKey: 'restaurant_id', targetKey: 'restaurant_id' });
    }
};