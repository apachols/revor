const Sequelize = require('sequelize');
const testConfig = require('../config')('test');
const testDB = new Sequelize(...testConfig.database);

const UserModel = require('../model/user');
const OwnerModel = require('../model/owner');
const ReviewModel = require('../model/review');
const SitterModel = require('../model/sitter');
const StayModel = require('../model/stay');
const OverallRankModel = require('../model/overallrank');

/**
 * Create/update overall rank record for sitter from review data in test db
 */
const updateOverallRank = async (sitterid) => {
  const sitterModel = SitterModel(testDB);
  const overallRankModel = OverallRankModel(testDB);

  const sitter = await sitterModel.findOne({ where: { sitterid }});
  const overallrank = await overallRankModel.findOrCreate({
    where: { sitterid }
  }).spread((overallrank, created) => {
    if (created) {
      overallrank.set('sitterscore', sitter.sitterScore());
    }
    return overallrank;
  });
  return await overallrank.calculateOverallRank();
}

/**
 * Adds test data for a stay and a review
 */
const addStayAndReview = async (sitterid, ownerid, start, end, rating, text) => {
  const stayModel = StayModel(testDB);
  const reviewModel = ReviewModel(testDB);
  const stay = await stayModel.create({
    sitterid, ownerid, start, end
  });
  return await reviewModel.factory({
    sitterid, ownerid, stayid: stay.get('stayid'), rating, text
  });
}

/**
 * Adds test data for a user, and a sitter and an owner record for that user
 */
const addUserOwnerAndSitter = async(name) => {
  const userModel = UserModel(testDB);
  const sitterModel = SitterModel(testDB);
  const ownerModel = OwnerModel(testDB);

  const user = await userModel.create({
    email: 'email@example.com',
    phone: '+18005551212'
  });
  const sitter = await sitterModel.create({
    name,
    image: 'http://placekitten.com/g/500/500?user=11',
    userid: user.get('userid')
  });
  const owner = await ownerModel.create({
    name,
    image: 'http://placekitten.com/g/500/500?user=12',
    userid: user.get('userid')
  });

  const userid = user.get('userid');
  const sitterid = sitter.get('sitterid');
  const ownerid = owner.get('ownerid');

  return { userid, sitterid, ownerid };
}

module.exports = { testDB, addStayAndReview, addUserOwnerAndSitter, updateOverallRank };
