const Sequelize = require('sequelize');

const User = db => db.define('user', {
  userid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: Sequelize.STRING,
  phone: Sequelize.STRING,
  created: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updated: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  // sequelize likes to pluralize table names
  freezeTableName: true,
  tableName: 'user',
  timestamps: false
});

module.exports = User;
