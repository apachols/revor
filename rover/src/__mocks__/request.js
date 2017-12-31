const users = {
  4: {name: 'Mark'},
  5: {name: 'Paul'},
};

export const getUsers = (url) => {
  return Promise.resolve(users);
}
