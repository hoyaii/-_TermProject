const Sequelize = require('sequelize');
const User = require('./User');
const Menu = require('./Menu');
const Review = require('./Review');
const Restaurant = require('./Restaurant');
const Orders = require('./Orders');
const Delivery = require('./Delivery');

const sequelize = new Sequelize('dbTermProject', 'root', '0623', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

// 모델 초기화
User.init(sequelize);
Menu.init(sequelize);
Review.init(sequelize);
Restaurant.init(sequelize);
Orders.init(sequelize);
Delivery.init(sequelize);

// 모델 간 관계 설정
User.associate(sequelize.models);
Menu.associate(sequelize.models);
Review.associate(sequelize.models);
Restaurant.associate(sequelize.models);
Orders.associate(sequelize.models);
Delivery.associate(sequelize.models);

module.exports = {
    User: sequelize.models.User,
    Review: sequelize.models.Review,
    Restaurant: sequelize.models.Restaurant,
};
