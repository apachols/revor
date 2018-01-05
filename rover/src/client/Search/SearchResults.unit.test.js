import React from 'react';

import SearchResults from './SearchResults';

import SearchResult from './SearchResult';

import Pager from './Pager';

import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('SearchResults unit tests', () => {
  const props = {
    pending: false,
    sitters: [],
    pageNumber: 1,
    totalPages: 0,
    changePageNumber: jest.fn()
  };

  it('should render No Sitters message for zero SearchResults', () => {
    const div = document.createElement('div');
    const enzymeWrapper = mount(<SearchResults {...props} />);
    expect(enzymeWrapper.text().indexOf(
      "We couldn't find any sitters that matched your criteria"
    )).not.toBe(-1);
    expect(enzymeWrapper.find(Pager).length).toBe(0);
  });

  it('should render Loading message for loading SearchResults', () => {
    const div = document.createElement('div');
    const useProps = {...props, pending: true};
    const enzymeWrapper = mount(<SearchResults {...useProps} />);
    expect(enzymeWrapper.text().indexOf("Loading...")).not.toBe(-1);
    expect(enzymeWrapper.find(Pager).length).toBe(0);
  });

  describe('test with results present', () => {
    let enzymeWrapper;
    beforeEach(() => {
      const div = document.createElement('div');
      const image = 'http://placekitten.com/g/500/500?user=338';
      const useProps = {...props, totalPages: 1, sitters: [
        { name: 'Adam P.', rating: 4, image, reviewCount: 10, repeatCount: 5 },
        { name: 'Rosie L.', rating: 5, image, reviewCount: 10, repeatCount: 0 }
      ]};
      enzymeWrapper = mount(<SearchResults {...useProps} />);
    });
    it('should render SearchResults when sitters array prop not empty', () => {
      expect(enzymeWrapper.find(SearchResult).length).toBe(2);
    });
    it('should render SearchResults when sitters array prop not empty', () => {
      expect(enzymeWrapper.find(Pager).length).toBe(1);
    });
  });
});
