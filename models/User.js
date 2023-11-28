const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            user_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            username: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            role: {
                type: Sequelize.ENUM('Customer', 'RestaurantOwner', 'DeliveryPerson', 'ServiceProvider'),
                allowNull: false,
            },
            phone_number: {
                type: Sequelize.STRING(15),
            },
            restaurant_id: {
                type: Sequelize.INTEGER,
            },
            service_area: {
                type: Sequelize.STRING(255),
            },
            status: {
                type: Sequelize.STRING(255),
            },
            address: {
                type: Sequelize.STRING(255),
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        
    }
};
