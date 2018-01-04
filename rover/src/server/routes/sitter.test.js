import sitterRoute from './sitter'

it('should have the search route handler defined', () => {
  const { sitterSearch } = sitterRoute({});
  expect(sitterSearch).not.toBeUndefined();
});

it('should return data from the database with no params', async () => {
  const { sitterSearch } = sitterRoute({
    getSittersByOverallRank: () => Promise.resolve({ 4: 'Lauren B.' })
  });
  const ctx = { request: { query: {} } };

  await sitterSearch(ctx);
  expect(ctx.body).toEqual(JSON.stringify({ 4: 'Lauren B.' }));
});

it('should pass ok rating to search service', async () => {
  const { sitterSearch } = sitterRoute({
    getSittersByOverallRank: (page, rating) => Promise.resolve(rating)
  });
  const ctx = { request: { query: { rating: 5 } } };

  await sitterSearch(ctx);
  expect(ctx.body).toEqual("5");
});

it('should pass zero to search service for bad rating', async () => {
  const { sitterSearch } = sitterRoute({
    getSittersByOverallRank: (page, rating) => Promise.resolve(rating)
  });
  const ctx = { request: { query: { rating: 'asdf' } } };

  await sitterSearch(ctx);
  expect(ctx.body).toEqual("0");
});

it('should pass ok page to search service', async () => {
  const { sitterSearch } = sitterRoute({
    getSittersByOverallRank: (page, rating) => Promise.resolve(page)
  });
  const ctx = { request: { query: { page: 2 } } };

  await sitterSearch(ctx);
  expect(ctx.body).toEqual("2");
});

it('should pass zero to search service for bad page', async () => {
  const { sitterSearch } = sitterRoute({
    getSittersByOverallRank: (page, rating) => Promise.resolve(page)
  });
  const ctx = { request: { query: { page: '{ a: 1 }' } } };

  await sitterSearch(ctx);
  expect(ctx.body).toEqual("0");
});

it('should reject when error', async () => {
  const { sitterSearch } = sitterRoute({
    findAll: () => Promise.reject('mysql hates it precious')
  });
  const ctx = {};

  await sitterSearch(ctx);
  expect(ctx.status).toEqual(500);
});
