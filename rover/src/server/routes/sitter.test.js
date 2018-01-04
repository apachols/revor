import sitterRoute from './sitter'

it('should have the search route handler defined', () => {
  const { getSitters } = sitterRoute({});
  expect(getSitters).not.toBeUndefined();
});

it('should resolve data from the database on success', async () => {
  const { getSitters } = sitterRoute({
    getSittersByOverallRank: () => Promise.resolve({ 4: 'Lauren B.' })
  });
  const ctx = {};

  await getSitters(ctx);
  expect(ctx.body).toEqual(JSON.stringify({ 4: 'Lauren B.' }));
});

it('should reject when error', async () => {
  const { getSitters } = sitterRoute({
    findAll: () => Promise.reject('mysql hates it precious')
  });
  const ctx = {};

  await getSitters(ctx);
  expect(ctx.status).toEqual(500);
});
