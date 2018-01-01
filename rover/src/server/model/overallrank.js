const Sequelize = require('sequelize');

const OverallRankModel = db => {

  const ReviewModel = require('./review')(db);
  const SitterModel = require('./sitter')(db);

  const model = db.define('overallrank', {
    overallrankid: {
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
    sitterscore: {
      type: Sequelize.DOUBLE,
      defaultValue: 0
    },
    ratingcount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: true
      }
    },
    ratingtotal: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: true
      }
    },
    ratingscore: {
      type: Sequelize.DOUBLE,
      defaultValue: 0
    },
    overallrank: {
      type: Sequelize.DOUBLE,
      defaultValue: 0
    },
    dirty: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
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
    tableName: 'overallrank',
    timestamps: false
  });

  // Set up foreignKey relationships
  model.hasOne(SitterModel, { as: 'Sitter', foreignKey: 'sitterid', targetKey: 'sitterid' });

  model.prototype.roverWeightedAverage = function(sitterScore, ratingCount, ratingSum, ratingScore) {
    const sitterScoreWeight = Number((Math.max(10 - ratingCount, 0) / 10).toFixed(1));
    const ratingScoreWeight = Number((Math.min(ratingCount, 10) / 10).toFixed(1));
    const overallRank = Number((sitterScore*sitterScoreWeight).toFixed(4))
                      + Number((ratingScore*ratingScoreWeight).toFixed(4));
    return Number((overallRank).toFixed(4));
  };

  model.prototype.recalculateOverallRank = async function(rating) {
    if ([1,2,3,4,5].indexOf(rating) === -1) {
      throw new Error('Rating outside of int 1-5 in recalculateOverallRank');
    }

    const ratingCount = this.getDataValue('ratingcount') + 1
    this.setDataValue('ratingcount', ratingCount);

    const ratingTotal = parseInt(this.getDataValue('ratingtotal')) + parseInt(rating);
    this.setDataValue('ratingtotal', ratingTotal);

    const ratingScore = Number((ratingCount > 0 ? ratingTotal / ratingCount: 0).toFixed(4));
    this.setDataValue('ratingscore', ratingScore);

    const overallrank = this.roverWeightedAverage(
      this.getDataValue('sitterscore'), ratingCount, ratingTotal, ratingScore
    );
    this.setDataValue('overallrank', overallrank);

    return this.save();
  };

  model.prototype.calculateOverallRank = async function() {
    const sitterid = this.get('sitterid');
    const where = { 'where': { sitterid } };
    const sitter = await SitterModel.find(where);

    const sitterScore = sitter.sitterScore();
    this.setDataValue('sitterscore', sitterScore);

    // TODO make only one query for count and total
    const ratingCount = await ReviewModel.count(where);
    this.setDataValue('ratingcount', ratingCount);

    const ratingTotal = await ReviewModel.sum('rating', where);
    this.setDataValue('ratingtotal', ratingTotal);

    const ratingScore = Number((ratingCount > 0 ? ratingTotal / ratingCount: 0).toFixed(4));
    this.setDataValue('ratingscore', ratingScore);

    const overallrank = this.roverWeightedAverage(
      sitterScore, ratingCount, ratingTotal, ratingScore
    );
    this.setDataValue('overallrank', overallrank);

    return this.save();
  };

  return model;
}

module.exports = OverallRankModel;
