// db
const Sequelize = require('sequelize');

// TODO CONFIG
const db = new Sequelize('rover.db', 'username', 'password', {
  dialect: 'sqlite',
  storage: './rover.db'
});
// const db = new Sequelize('rover', 'root', '123lqsym)(*', {
//   dialect: 'mysql',
//   host: '35.197.70.0'
// });

module.exports = db;
