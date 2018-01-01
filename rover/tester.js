
const db = require('./src/server/db');

const OverallRankModel = require('./src/server/model/overallrank')(db);

const tester = async () => {
  // await Promise.all([
  //   OverallRankModel.sync({force: true}),
  // ]);
  const o = await OverallRankModel.findOrCreate({
    where: { sitterid: 1 }
  }).then(o => {
    console.log(o);
    return o.calculateOverallRank();
  })
  return o;
  // const o = await OverallRankModel.create({
  //   sitterid: 1
  // });
  // return o.calculateOverallRank();
}

tester().then((o) => {
  console.log('Done! overallrank: ' + o);
});
