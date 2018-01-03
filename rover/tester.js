
const db = require('./src/server/db');

const cleanDB = require('./src/server/cleandb')(db);

const tester = async () => {
  await cleanDB();
}

tester().then(() => {
  console.log('Done!');
});
