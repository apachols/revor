import React from 'react';

import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';

import { Search } from './Search';

jest.mock('./SearchBox');
jest.mock('./SearchResults');

Enzyme.configure({ adapter: new Adapter() });

describe('Search component unit tests', () => {
  const props = {
    changePageNumber: jest.fn(),
    changeMinimumRating: jest.fn(),
    getSittersSearchResults: jest.fn(),
    sitters: [],
    totalPages: 0,
    pageNumber: 1,
    rating: 1,
    pending: false
  };

  it('should call getSittersSearchResults on mount', () => {
    const div = document.createElement('div');
    const useProps = {
      ...props,
      getSittersSearchResults: jest.fn()
    };
    const enzymeWrapper = mount(
      <Search {...useProps}/>
    );
    expect(useProps.getSittersSearchResults.mock.calls.length).toBe(1);
  });

  it('should call changeMinimumRating and getSittersSearchResults from SearchBox', () => {
    const div = document.createElement('div');

    const useProps = {
      ...props,
      getSittersSearchResults: jest.fn(),
      changeMinimumRating: () => Promise.resolve()
    };
    const enzymeWrapper = mount(
      <Search {...useProps}/>
    );

    expect(enzymeWrapper.text().indexOf('MockSearchBox')).not.toBe(-1);
    enzymeWrapper.find('.mock-search-box').simulate('click');
    expect(useProps.getSittersSearchResults.mock.calls.length).toBe(2);
  });

  it('should call changePageNumber and getSittersSearchResults from SearchResults', () => {
    const div = document.createElement('div');

    const useProps = {
      ...props,
      getSittersSearchResults: jest.fn(),
      changePageNumber: () => Promise.resolve()
    };
    const enzymeWrapper = mount(
      <Search {...useProps}/>
    );

    expect(enzymeWrapper.text().indexOf('MockSearchResults')).not.toBe(-1);
    enzymeWrapper.find('.mock-search-results').simulate('click');
    expect(useProps.getSittersSearchResults.mock.calls.length).toBe(2);
  });
})
