const router = require('koa-router')();

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
    .get('/search', async function(ctx){
      ctx.redirect('/#/search');
    })
    .get('/time', async function(ctx) {
      ctx.body = Math.floor(new Date() / 1000);
    })
    .get('/api/sitter/search', sitterSearch);

  return router;
};
