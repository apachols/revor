/**
 * Serves static assets out of the build directory:
 *
 *   build/
 *
 * Serves /api/ requests as well (look in routes/router.js):
 *
 *   /api/*
 */
const Koa = require('koa');

//
// Configure
//
const app = module.exports = new Koa();

const serve = require('koa-static');
app.use(serve('./build'));

// TODO this is not working?
const compress = require('koa-compress');
app.use(compress());

// http logger
const { file, dev } = require('./server/logger');
if (process.env.NODE_ENV !== 'production') {
  app.use(dev);
} else {
  app.use(file);
}

// database
const db = require('./server/db');

// router
const router = require('./server/routes/router')(db);

//
// Start
//
app.use(router.routes());
app.listen(3030);
console.log('app listening on 3030');

//
// Cleanup and exit
//
const nodeCleanup = require('node-cleanup');
nodeCleanup(function (exitCode, signal) {
  console.log('FOUND EXIT', exitCode, signal);
  db.close().then(() => {
    console.log('db connection closed');
  });
});
