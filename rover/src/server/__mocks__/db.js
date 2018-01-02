const Sequelize = require('sequelize');
const testConfig = require('../config')('test');
const testDB = new Sequelize(...testConfig.database);

const UserModel = require('../model/user');
const OwnerModel = require('../model/owner');
const ReviewTextModel = require('../model/reviewtext');
const ReviewModel = require('../model/review');
const OverallRankModel = require('../model/overallrank');
const SitterModel = require('../model/sitter');

const setupTestDB = () => {
  return testDB.authenticate().then(async () => {
    const ownerModel = OwnerModel(testDB);
    const userModel = UserModel(testDB);
    const reviewModel = ReviewModel(testDB);
    const reviewTextModel = ReviewTextModel(testDB);
    const sitterModel = SitterModel(testDB);
    const overallrankModel = OverallRankModel(testDB);
    await Promise.all([
      overallrankModel.sync({ force: true }),
      reviewModel.sync({ force: true }),
      reviewTextModel.sync({ force: true }),
      sitterModel.sync({ force: true }),
      ownerModel.sync({ force: true }),
      userModel.sync({ force: true })
    ])
    // TODO - all this shared setup will need to be split out...
    const user1 = await userModel.create({
      email: 'one@example.com',
      phone: '+18005551212'
    });
    const sitter1 = await sitterModel.create({
      name: 'User 1',
      image: 'http://placekitten.com/g/500/500?user=11',
      userid: user1.get('userid')
    });
    await ownerModel.create({
      name: 'User 1',
      image: 'http://placekitten.com/g/500/500?user=12',
      userid: user1.get('userid')
    });
    const user2 = await userModel.create({
      email: 'two@example.com',
      phone: '+18005551234'
    });
    await sitterModel.create({
      name: 'User 2',
      image: 'http://placekitten.com/g/500/500?user=11',
      userid: user2.get('userid')
    });
    const owner2 = await ownerModel.create({
      name: 'User 2',
      image: 'http://placekitten.com/g/500/500?user=12',
      userid: user2.get('userid')
    });
    await reviewModel.factory({
      rating: 5,
      ownerid: owner2.get('ownerid'),
      sitterid: sitter1.get('sitterid'),
      text: 'Excellent work, thank you!',
      start: '2018-01-01',
      end: '2018-01-01'
    });
    await reviewModel.factory({
      rating: 1,
      ownerid: owner2.get('ownerid'),
      sitterid: sitter1.get('sitterid'),
      text: 'Returned different housekey than the one I left??',
      start: '2017-12-22',
      end: '2017-12-27'
    });
    // user / sitter 3
    const user3 = await userModel.create({
      email: 'three@example.com',
      phone: '+18005551255'
    });
    await sitterModel.create({
      name: 'User 3',
      image: 'http://placekitten.com/g/500/500?user=13',
      userid: user3.get('userid')
    });
  });
}

module.exports = { testDB, setupTestDB };
