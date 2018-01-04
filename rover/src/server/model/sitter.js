const Sequelize = require('sequelize');

const SitterModel = db => {
  const UserModel = require('./user')(db);

  const model = db.define('sitter', {
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

  // Foreign key relationships
  model.hasOne(UserModel, { as: 'User', foreignKey: 'userid', targetKey: 'userid' });

  // Sitter score
  model.prototype.sitterScore = function() {
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const name = this.get('name').toLowerCase();

    const map = {};
    for (let ii=0; ii < name.length; ii++) {
      if (alpha.indexOf(name[ii]) !== -1) {
        map[name[ii]] = 1;
      }
    }
    let count = 0;
    for (let k in map) {
      if (map.hasOwnProperty(k)) {
        count++;
      }
    }
    return Number((5 * count / alpha.length).toFixed(4));
  };

  return model;
}

module.exports = SitterModel;
