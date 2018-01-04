const Sequelize = require('sequelize');

const StayModel = db => {

  const SitterModel = require('./sitter')(db);
  const OwnerModel = require('./owner')(db);

  const model = db.define('stay', {
    stayid: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sitterid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        'model': SitterModel,
        'key': 'sitterid'
      },
    },
    ownerid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        'model': OwnerModel,
        'key': 'ownerid'
      },
    },
    start: {
      type: Sequelize.DATE,
      validate: {
        isDate: true,
        notEmpty: true
      }
    },
    end: {
      type: Sequelize.DATE,
      validate: {
        isDate: true,
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
    validate: {
      startAfterEnd() {
        if (this.start > this.end) {
          throw new Error('Start date must be on or after End date');
        }
      }
    },
    indexes: [
      { fields: ['stayid'] },
      { fields: ['sitterid'] }
    ],
    freezeTableName: true,
    tableName: 'stay',
    timestamps: false
  });

  // Set up foreignKey relationships
  model.hasOne(SitterModel, { as: 'Sitter', foreignKey: 'sitterid', targetKey: 'sitterid' });
  model.hasOne(OwnerModel, { as: 'Owner', foreignKey: 'ownerid', targetKey: 'ownerid' });

  return model;
}

module.exports = StayModel;
