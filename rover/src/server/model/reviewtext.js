const Sequelize = require('sequelize');

const ReviewText = db => db.define('reviewtext', {
  reviewtextid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reviewid: {
    type: Sequelize.INTEGER
  },
  text: {
    type: Sequelize.STRING(2048),
    validate: {
      notEmpty: true
    }
  }
}, {
  freezeTableName: true,
  tableName: 'reviewtext',
  timestamps: false
});

module.exports = ReviewText;
