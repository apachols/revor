const Sequelize = require('sequelize');

const db = new Sequelize('rover.db', 'username', 'password', {
  dialect: 'sqlite',
  storage: './rover.db'
});

const Sitter = require('./src/lib/model/sitter')(db);

const tester = async () => {
  await Sitter.sync({force: true})

  await Sitter.create({
    name: 'harry potter',
    userid: 2,
    imageid: 2
  });

  db.close().then( () => console.log('all done!'));
}

tester();
