const Sequelize = require('sequelize');

module.exports = class Menu extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            menu_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            restaurant_id: {
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING(255),
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Menu',
            tableName: 'menus',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Menu.belongsTo(db.Restaurant, { foreignKey: 'restaurant_id', targetKey: 'restaurant_id' });
    }
};