/**
 * Returns a database connection to database specified in config found for NODE_ENV.
 */

const Sequelize = require('sequelize');

const config = require('./config')(process.env.NODE_ENV);

const db = new Sequelize(...config.database);

module.exports = db;
