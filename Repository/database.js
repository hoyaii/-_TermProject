const Sequelize = require('sequelize');

const sequelize = new Sequelize('dbTermProject', 'root', '0623', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

module.exports = sequelize;
