const Sequelize = require('sequelize');

module.exports = class Restaurant extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            restaurant_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            owner_id: {
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING(255),
            },
            address: {
                type: Sequelize.STRING(255),
            },
            cuisine_type: {
                type: Sequelize.STRING(255),
            },
            service_area: {
                type: Sequelize.STRING(255),
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Restaurant',
            tableName: 'restaurants',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Restaurant.hasMany(db.Menu, { foreignKey: 'restaurant_id', sourceKey: 'restaurant_id' });
        db.Restaurant.belongsTo(db.User, { foreignKey: 'owner_id', targetKey: 'user_id' });
    }
};
