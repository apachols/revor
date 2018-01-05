import React from 'react';

import SearchResult from './SearchResult';

import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('search result unit tests', () => {
  const props = {
    sitter: {
      name: 'Adam P.',
      rating: 5,
      image: 'http://placekitten.com/g/500/500?user=338',
      reviewCount: 10,
      repeatCount: 5
    }
  };

  it('should render SearchResult for sitter with multiple repeat clients', () => {
    const div = document.createElement('div');
    const enzymeWrapper = mount(<SearchResult {...props} />)

    expect(enzymeWrapper.find('.review-info-item').length).toBe(2);
    expect(enzymeWrapper.text().indexOf('REPEAT CLIENTS')).not.toBe(-1);
  });

  it('should render SearchResult for sitter with 1 repeat client', () => {
    const div = document.createElement('div');
    const useProps = {  sitter: { ...props.sitter, repeatCount: 1 } };
    const enzymeWrapper = mount(<SearchResult {...useProps} />);

    expect(enzymeWrapper.find('.review-info-item').length).toBe(2);
    expect(enzymeWrapper.text().indexOf('REPEAT CLIENTS')).toBe(-1);
    expect(enzymeWrapper.text().indexOf('REPEAT CLIENT')).not.toBe(-1);
  });

  it('should render SearchResult for sitter without repeat clients', () => {
    const div = document.createElement('div');
    const useProps = {  sitter: { ...props.sitter, repeatCount: 0 } };
    const enzymeWrapper = mount(<SearchResult {...useProps} />);
    expect(enzymeWrapper.find('.review-info-item').length).toBe(1);
  });

})
