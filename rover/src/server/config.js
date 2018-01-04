/**
 * Loads an environment specific config based on a supplied environment (process.env.NODE_ENV)
 *
 *   'test'       loads config/test.js
 *   'local'      loads config/local.js
 *   'production' loads config.production.js
 *
 *   undefined    loads config/local.js
 */
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
    console.error(errmsg);
    console.error(error);
    throw error;
  }
};
