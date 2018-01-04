const Sequelize = require('sequelize');

const UserModel = db => db.define('user', {
  userid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isPhone: (value) => {
        if (!value || !(/^\+\d*$/g).test(value) || value.length !== 12) {
          throw new Error('Invalid phone number');
        }
      }
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
  indexes: [
    { fields: ['userid'] },
    { fields: ['email','phone']}
  ],
  // sequelize likes to pluralize table names
  freezeTableName: true,
  tableName: 'user',
  timestamps: false
});

module.exports = UserModel;
