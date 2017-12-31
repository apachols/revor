const Koa = require('koa');
const router = require('koa-router')();

const sqlite = require('sqlite');
const dbPromise = sqlite.open('./rover.db');

const app = module.exports = new Koa();

const morgan = require('koa-morgan');

// server logs to disk in apache combined format
const fs = require('fs');
const accessLogStream = fs.createWriteStream(__dirname + '/../logs/access.log',
                                             { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream })); // file
app.use(morgan('dev')); // log to console in concise format

const serve = require('koa-static');
app.use(serve('./build'));

compress = require('koa-compress');
app.use(compress());

// routes
router
  // .get('/', async function(ctx) {
  //   ctx.body = 'Hello World';
  // })
  .get('/time', async function(ctx) {
    ctx.body = Math.floor(new Date() / 1000);
  })
  .get('/api/users', async function(ctx) {
    const db = await dbPromise;
    const users = await db.all('SELECT * FROM user order by userid desc');
    ctx.body = JSON.stringify(users);
  })
  .get('/migrate', async function(ctx) {
    const db = await dbPromise;
    db.migrate({ migrationsPath: './migrations' });
    ctx.body = 'Database Created';
  });

app.use(router.routes());

app.listen(3030);
console.log('app listening on 3030')
