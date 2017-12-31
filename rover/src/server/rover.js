const Koa = require('koa');
const morgan = require('koa-morgan');
const fs = require('fs');

//
// Configure
//
const app = module.exports = new Koa();

// TODO - logger file

// server logs to disk in apache combined format
const accessLogStream = fs.createWriteStream(
  __dirname + '/../../logs/access.log', { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream })); // file
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')); // log to console in concise format
}

const serve = require('koa-static');
app.use(serve('./build'));

compress = require('koa-compress');
app.use(compress());

// router
const router = require('./routes/router');

//
// Start
//
app.use(router.routes());

app.listen(3030);
console.log('app listening on 3030')

//
// Cleanup and exit
//
const db = require('./db');

const nodeCleanup = require('node-cleanup');
nodeCleanup(function (exitCode, signal) {
  db.close().then(() => {
    console.log('db connection closed');
  });
});
