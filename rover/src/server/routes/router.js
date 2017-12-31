const router = require('koa-router')();

module.exports = db => {
  // routes
  const UserModel = require('../model/user')(db);
  const { getAllUsers } = require('./user')(UserModel);

  router
    .get('/time', async function(ctx) {
      ctx.body = Math.floor(new Date() / 1000);
    })
    .get('/api/users', getAllUsers);

  return router;
};
