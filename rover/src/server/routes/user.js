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
      ctx.body = 'Infernal Server Error';
      console.error('ERROR: getAllUsers:', error);
    }
  }

  return { getAllUsers };
};
