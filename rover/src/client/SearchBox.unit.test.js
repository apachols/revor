import React from 'react';

import SearchBox from './SearchBox';

import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('SearchBox unit tests', () => {
  const props = {
    rating: 4,
    onRatingChange: jest.fn()
  };

  it('should render 5 stars of possible selected ratings', () => {
    const div = document.createElement('div');
    const enzymeWrapper = mount(<SearchBox {...props} />)
    expect(enzymeWrapper.find('i').length).toBe(5);
  });

  // For whatever reason the star rating component renders the stars
  // in reverse order in the DOM.  Weird!  This test is overreaching a bit
  //  anyway, but I just figured out how to simulate clicks, so here goes :)
  it('should call onRatingChange(5) when first star clicked', () => {
    const div = document.createElement('div');
    const enzymeWrapper = mount(<SearchBox {...props} />)
    enzymeWrapper.find('i').at(0).simulate('click');
    expect(props.onRatingChange.mock.calls[0][0]).toBe(5);
  });
})
