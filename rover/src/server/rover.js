const Koa = require('koa');

//
// Configure
//
const app = module.exports = new Koa();

const serve = require('koa-static');
app.use(serve('./build'));

compress = require('koa-compress');
app.use(compress());

// logger
const { file, dev } = require('./logger');
if (process.env.NODE_ENV !== 'production') {
  app.use(dev);
} else {
  app.use(file);
}

// database
const db = require('./db');

// router
const router = require('./routes/router')(db);

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
  db.close().then(() => {
    console.log('db connection closed');
  });
});
