import SitterModel from './sitter'

import testDB from '../db';

jest.mock('../db');

const userid = 32;
const name = 'Adam P.';
const image = 'http://placekitten.com/g/500/500?user=12';
const validSitter = { name, image, userid };

describe('data validation', () => {
  // TODO is there some way to condense these?
  it('should not allow empty name', done => {
    const Sitter = SitterModel(testDB);
    const s = Sitter.build({ ...validSitter, name: ''});
    s.validate().catch(e => {
      expect(e.name).toMatch('SequelizeValidationError');
      done();
    });
  });
  it('should not allow empty image', done => {
    const Sitter = SitterModel(testDB);
    const s = Sitter.build({ ...validSitter, image: ''});
    s.validate().catch(e => {
      expect(e.name).toMatch('SequelizeValidationError');
      done();
    });
  });
  it('should not allow bad url image', done => {
    const Sitter = SitterModel(testDB);
    const s = Sitter.build({ ...validSitter, image: '/dev/null'});
    s.validate().catch(e => {
      expect(e.name).toMatch('SequelizeValidationError');
      done();
    });
  });
});

describe('database operations', () => {
  // TODO, or maybe move this to integration test
});
