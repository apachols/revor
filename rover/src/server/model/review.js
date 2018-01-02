const Sequelize = require('sequelize');

const ReviewModel = db => {

  const ReviewTextModel = require('./reviewtext')(db);
  const SitterModel = require('./sitter')(db);
  const OwnerModel = require('./owner')(db);

  const model = db.define('review', {
    reviewid: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    reviewtextid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        'model': ReviewTextModel,
        'key': 'reviewtextid'
      },
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

  // Set up foreignKey relationships
  model.hasOne(ReviewTextModel, { as: 'Text', foreignKey: 'reviewtextid', targetKey: 'reviewtextid' });
  model.hasOne(SitterModel, { as: 'Sitter', foreignKey: 'sitterid', targetKey: 'sitterid' });
  model.hasOne(OwnerModel, { as: 'Owner', foreignKey: 'ownerid', targetKey: 'ownerid' });

  model.getRatingStats = async function(sitterid) {
    const where = { 'where': { sitterid } };
    const records = await model.findAll(where);
    let ratingtotal = 0, ratingcount = 0;
    if (records !== null) {
      for (let ii=0; ii < records.length; ii++) {
        ratingcount += 1;
        ratingtotal += records[ii].get('rating');
      }
    }
    return { ratingtotal, ratingcount };
  };

  // creates a review and reviewtext record
  model.factory = (data) => {
    const text = data.text;
    return ReviewTextModel.create({ text }).then(async (reviewtext) => {
      const reviewtextid = reviewtext.get('reviewtextid');
      return model.create({ ...data, reviewtextid });
    });
  };

  return model;
}

module.exports = ReviewModel;
