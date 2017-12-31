const morgan = require('koa-morgan');
const fs = require('fs');

// server logs to disk in apache combined format
const accessLogStream = fs.createWriteStream(
  __dirname + '/../../logs/access.log', { flags: 'a' }
);

module.exports = {
  file: morgan('combined', { stream: accessLogStream }),
  dev: morgan('dev')
}
