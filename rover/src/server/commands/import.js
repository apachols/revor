const db = require('../db');

const User = require('../model/user')(db);

const Sitter = require('../model/sitter')(db);

const runImport = async () => {
  await Promise.all([
    User.sync({ force: true }),
    Sitter.sync({ force: true })
  ]);
  const user = await User.create({
    email: 'potterh@hogwarts.edu',
    phone: 'owls, man'
  });
  await Sitter.create({
    name: 'harry potter',
    userid: user.get('userid'),
    imageid: 2
  });
  db.close().then( () => console.log('all done!'));
}

runImport()
