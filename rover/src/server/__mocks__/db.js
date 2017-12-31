const Sequelize = require('sequelize');
const testConfig = require('../config')('test');
const testDB = new Sequelize(...testConfig.database);

module.exports = testDB;
