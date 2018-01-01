const Sequelize = require('sequelize');

const Review = db => {
  const model = db.define('owner', {
    reviewid: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sitter: {
      type: Sequelize.INTEGER,
    },
    ownerid: {
      type: Sequelize.INTEGER,
    },
    rating: {
      type: Sequelize.INTEGER,
      validate: {
        isInt: true,
        min: 1,
        max: 5
      }
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
    freezeTableName: true,
    tableName: 'review',
    timestamps: false
  });

  const ReviewText = require('./reviewtext')(db);
  ReviewText.belongsTo(model, { foreignKey: 'reviewid', targetKey: 'reviewid' });
  return model;
}
module.exports = Review;
