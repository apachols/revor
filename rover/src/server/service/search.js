const { Op } = require('sequelize');

const SearchService = (db) => {
  const overallrank = require('../model/overallrank')(db);
  const sitter = require('../model/sitter')(db);

  return {
    getSittersByOverallRank: (minRating) => {
      const useMinRating = parseInt(minRating, 10) || 0;
      const query = {
        where:  {
          'ratingscore': {
            [Op.gte]: useMinRating
          }
        },
        include: [{
            model: sitter,
            as: 'Sitter'
        }],
        order: [
          ['overallrank', 'DESC']
        ]
      };

      return overallrank.findAll(query);
    }
  }
};

module.exports = SearchService;
