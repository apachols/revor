module.exports = {
  name: 'test',
  database: ['test.db', 'username', 'password', {
    dialect: 'sqlite',
    logging: false,
    storage: './test.db',
    operatorsAliases: false
  }]
}
