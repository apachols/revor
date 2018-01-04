const { logger } = require('../logger');

/**
 * [exports description]
 * @param  {Object} SearchService  Knows how to get search results
 * @return {Object}                Handler object with sitterSearch method
 */
module.exports = SearchService => {
  const sitterSearch = async ctx => {
    try {
      const page = parseInt(ctx.request.query.page, 10) || 0;
      const minRating = parseInt(ctx.request.query.rating, 10) || 0;
      const sitterData = await SearchService.getSittersByOverallRank(page, minRating);
      ctx.body = JSON.stringify(sitterData);
    } catch (error) {
      ctx.status = 500;
      ctx.body = 'Internal Server Error';
      logger.error('ERROR: getSitters:', error);
    }
  }

  return { sitterSearch };
};
