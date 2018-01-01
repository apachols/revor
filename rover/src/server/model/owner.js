const Sequelize = require('sequelize');

const Owner = db => db.define('owner', {
  ownerid: {
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
  userid: {
    type: Sequelize.INTEGER,
  },
  image: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true,
      notEmpty: true
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
    freezeTableName: true,
  tableName: 'owner',
  timestamps: false
});

module.exports = Owner;
