const { logger } = require('../logger');

/*
 * /api/user route handlers
 */
module.exports = UserModel => {
  const getAllUsers = async ctx => {
    try {
      const userData = await UserModel.findAll();
      ctx.body = JSON.stringify(userData);
    } catch (error) {
      ctx.status = 500;
      ctx.body = 'Internal Server Error';
      logger.error('ERROR: getAllUsers:', error);
    }
  }

  return { getAllUsers };
};
