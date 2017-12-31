import userRoute from './user'

it('should be defined', () => {
  const { getAllUsers } = userRoute({});
  expect(getAllUsers).not.toBeUndefined();
});

it('should resolve data from the database on success', async () => {
  const { getAllUsers } = userRoute({
    findAll: () => Promise.resolve({ 4: 'Denny' })
  });
  const ctx = {};

  await getAllUsers(ctx);
  expect(ctx.body).toEqual(JSON.stringify({ 4: 'Denny' }));

});

it('should reject when error', async () => {
  const { getAllUsers } = userRoute({
    findAll: () => Promise.reject('mysql hates it precious')
  });
  const ctx = {};

  await getAllUsers(ctx);
  expect(ctx.status).toEqual(500);
});
