const router = require('koa-router')();

const send = require('koa-send');

/**
 * Create handlers with db connection 'db', and set those handlers
 * to catch api/* routes.
 *
 * @param  {Object} db  sequelize db connection instance
 * @return {Object}     Configured KOA router middleware
 */
module.exports = db => {
  const SearchService = require('../service/search')(db);
  const { sitterSearch } = require('./sitter')(SearchService);

  router
    .get('/api/sitter/search', sitterSearch)
    .get('*', async (ctx) => {
      await send(ctx, 'build/index.html');
    });

  return router;
};
