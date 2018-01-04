const Sequelize = require('sequelize');


const OwnerModel = db => {
  const UserModel = require('./user')(db);
  const model = db.define('owner', {
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
      allowNull: false,
      references: {
        'model': UserModel,
        'key': 'userid'
      }
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
    indexes: [
      { fields: ['ownerid'] },
      { fields: ['userid','name'] }
    ],
    freezeTableName: true,
    tableName: 'owner',
    timestamps: false
  });

  return model;
}


module.exports = OwnerModel;
