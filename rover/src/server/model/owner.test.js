import OwnerModel from './owner'

import { testDB } from '../db';

jest.mock('../db');

const userid = 32;
const name = 'Adam P.';
const image = 'http://placekitten.com/g/500/500?user=12';
const validOwner = { name, image, userid };

describe('data validation', () => {
  // TODO is there some way to condense these?
  it('should not allow empty name', done => {
    const Owner = OwnerModel(testDB);
    const o = Owner.build({ ...validOwner, name: ''});
    o.validate().catch(e => {
      expect(e.name).toMatch('SequelizeValidationError');
      done();
    });
  });
  it('should not allow empty image', done => {
    const Owner = OwnerModel(testDB);
    const o = Owner.build({ ...validOwner, image: ''});
    o.validate().catch(e => {
      expect(e.name).toMatch('SequelizeValidationError');
      done();
    });
  });
  it('should not allow bad url image', done => {
    const Owner = OwnerModel(testDB);
    const o = Owner.build({ ...validOwner, image: '/dev/null'});
    o.validate().catch(e => {
      expect(e.name).toMatch('SequelizeValidationError');
      done();
    });
  });
});

describe('database operations', () => {
  // TODO, or maybe move this to integration test
});
