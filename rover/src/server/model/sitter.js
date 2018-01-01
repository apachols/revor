const Sequelize = require('sequelize');

const Sitter = db => db.define('sitter', {
  sitterid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  },
  userid: Sequelize.INTEGER,
  image: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
      isUrl: true
    }
  },
  // created / updated on most records by default
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
