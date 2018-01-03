const Sequelize = require('sequelize');

const DogModel = db => {
  const OwnerModel = require('./owner')(db);
  const model = db.define('dog', {
    dogid: {
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
    ownerid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        'model': OwnerModel,
        'key': 'ownerid'
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
    tableName: 'dog',
    timestamps: false
  });

  return model;
}


module.exports = DogModel;
