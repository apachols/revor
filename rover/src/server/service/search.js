const { Op } = require('sequelize');

const SearchService = (db) => {
  const overallrank = require('../model/overallrank')(db);
  const sitter = require('../model/sitter')(db);

  return {
    getSittersByOverallRank: (minRating) => {
      const query = {
        where:  {
          'ratingscore': {
            [Op.gte]: minRating || 0
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
      return overallrank.findAll(query).then((results) => {
        const formattedResults = [];
        for (let result of results) {
          formattedResults.push({
            name: result.Sitter.dataValues.name,
            image: result.Sitter.dataValues.image,
            rating: result.ratingscore
          });
        }
        return formattedResults;
      });
    }
  }
};

module.exports = SearchService;
