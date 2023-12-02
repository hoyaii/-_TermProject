const mysql = require('mysql2');
const env = process.env.NODE_ENV || 'development';
const config = require(process.cwd() + '/config/config.json')[env];

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: "root",
    password: "0623",
    database: "dbTermProject",
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
}).promise();

module.exports = pool;