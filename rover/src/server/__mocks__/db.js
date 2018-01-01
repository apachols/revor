const Sequelize = require('sequelize');
const testConfig = require('../config')('test');
const testDB = new Sequelize(...testConfig.database);

const UserModel = require('../model/user');
const OwnerModel = require('../model/owner');
const ReviewTextModel = require('../model/reviewtext');
const ReviewModel = require('../model/review');
const SitterModel = require('../model/sitter');

const setupTestDB = () => {
  return testDB.authenticate().then(async () => {
    const ownerModel = OwnerModel(testDB);
    const userModel = UserModel(testDB);
    const reviewModel = ReviewModel(testDB);
    const reviewTextModel = ReviewTextModel(testDB);
    const sitterModel = SitterModel(testDB);
    await Promise.all([
      reviewModel.sync({ force: true }),
      reviewTextModel.sync({ force: true }),
      sitterModel.sync({ force: true }),
      ownerModel.sync({ force: true }),
      userModel.sync({ force: true })
    ])
    const user1 = await userModel.create({
      email: 'one@example.com',
      phone: '+18005551212'
    });
    await sitterModel.create({
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
    await ownerModel.create({
      name: 'User 2',
      image: 'http://placekitten.com/g/500/500?user=12',
      userid: user2.get('userid')
    });
  });
}

module.exports = { testDB, setupTestDB };
