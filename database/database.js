const Sequelize = require("sequelize");
require("dotenv").config();

const connection = new Sequelize(process.env.DB_TABLE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: process.env.DB_TIMEZONE
});

module.exports = connection;