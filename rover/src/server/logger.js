/**
 * Configures and returns logger objects
 */

const fs = require('fs');
const path = require('path');
const appDirectory = fs.realpathSync(process.cwd());

// HTTP request logger (to file)
const morgan = require('koa-morgan');
const accessLogStream = fs.createWriteStream(
  path.resolve(appDirectory, 'logs/access.log'), { flags: 'a' }
);

// Turn off normal file-based error logging during test runs
const useEnvironmentLevel = (process.env.NODE_ENV === 'test' ? 'fatal': 'info');

// File based loggers for application and commands
const log4js = require('log4js');
log4js.configure({
  appenders: {
    'application': {
      type: 'file', filename: path.resolve(appDirectory, 'logs/app.log')
    }
  },
  categories: { default: { appenders: ['application'], level: useEnvironmentLevel } }
});

const appLogger = log4js.getLogger('application');

module.exports = {
  file: morgan('combined', { stream: accessLogStream }),
  dev: morgan('dev'),
  logger: appLogger
}
