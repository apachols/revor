
const db = require('./src/server/db');

const ReviewModel = require('./src/server/model/review')(db);
const ReviewTextModel = require('./src/server/model/reviewtext')(db);

const rating = 5;
const ownerid = 1;
const sitterid = 1;
const userid = 1;
const start = '2017-12-30';
const end = '2017-12-31';
const validReview = { rating, sitterid, ownerid, userid, start, end };

const tester = async () => {
  await Promise.all([
    ReviewModel.sync({force: true}),
    ReviewTextModel.sync({force: true})
  ]);
  const text = 'I ate an apple on a pirate ship';
  return ReviewModel.factory({ ...validReview, text });
}

tester().then((r) => r.getText()).then((t) => {
  console.log('Done! Review text: ' + t.get('text'));
});
