const { logger } = require('./logger');

const fs = require('fs');
const path = require('path');

const configName = env => {
  switch (env) {
    case 'production':
      return 'production';
    case 'test':
      return 'test';
    default:
      return 'local';
  }
}

module.exports = environment => {
  const configPath = 'config/' + configName(environment);
  const appDirectory = fs.realpathSync(process.cwd());

  try {
    const config = require(path.resolve(appDirectory, configPath));
    return config;
  } catch (error) {
    const errmsg = 'Unable to load config: ' + configPath;
    logger.error(errmsg);
    logger.error(error);
    throw error;
  }
};
