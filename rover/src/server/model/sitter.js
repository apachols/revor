const Sequelize = require('sequelize');

const Sitter = db => db.define('sitter', {
  sitterid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  userid: Sequelize.INTEGER,
  imageid: Sequelize.INTEGER,
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
  tableName: 'sitter',
  timestamps: false
});

module.exports = Sitter;
