import search from './search';

import { testDB } from '../db';

jest.mock('../db');

const cleanDB = require('../cleandb')(testDB);

describe('search service integration tests', () => {
  beforeAll(async () => {
      await cleanDB();
  });

  it('should return some sitters', () => {
    expect(search).toBeDefined();
  });

  it('should filter by rank', () => {
    expect(search).toBeDefined();
  });

  it('should filter by name', () => {
    expect(search).toBeDefined();
  });
});
