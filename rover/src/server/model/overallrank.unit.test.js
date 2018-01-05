import OverallRankModel from './overallrank'

import { testDB } from '../db';

jest.mock('../db');

describe('roverWeightedAverage', () => {
  const model = OverallRankModel(testDB);

  it('should return zero when all zeros are passed', () => {
    expect(model.roverWeightedAverage(0,0,0,0)).toEqual(0);
  });

  it('should return sitter score when no ratings are given', () => {
    const sitscore = 2.1;
    const count = 0;
    const sum = 0;
    const average = 0;
    expect(model.roverWeightedAverage(sitscore, count, sum, average)).toEqual(2.1);
  });

  it('should return rating score when 10 ratings are given', () => {
    const sitscore = 2.1;
    const count = 10;
    const sum = 49;
    const average = 4.9;
    expect(model.roverWeightedAverage(sitscore, count, sum, average)).toEqual(4.9);
  });

  it('should pass the 10 rating test given in the project spec', () => {
    const sitscore = 2.5;
    const results = [
      2.5, 2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0, 5.0
    ];

    for (let ii=0; ii < results.length; ii++) {
      let count = ii;
      let sum = 5*count;
      let average = 5;
      let left = model.roverWeightedAverage(sitscore, count, sum, average);
      let right = results[ii];
      expect(left).toEqual(right);
    }
  });

});
