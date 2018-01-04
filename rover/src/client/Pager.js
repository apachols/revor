import React from 'react'

const ReactUltimatePagination = require('react-ultimate-pagination');

const Page = props => {
  return (
    <button onClick={props.onClick} style={props.isActive ? {fontWeight: 'bold'} : null}>
      {props.value}
    </button>
  )
}

const Wrapper = props => {
  return <div className="pagination">{props.children}</div>
}

const itemTypeToComponent = {
  'PAGE': Page,
  'ELLIPSIS': props => <button onClick={props.onClick}>...</button>,
  'FIRST_PAGE_LINK': props => '',
  'PREVIOUS_PAGE_LINK': props => <button onClick={props.onClick}>Previous</button>,
  'NEXT_PAGE_LINK': props => <button onClick={props.onClick}>Next</button>,
  'LAST_PAGE_LINK': props => '',
};

const Pager = ReactUltimatePagination.createUltimatePagination({
  itemTypeToComponent: itemTypeToComponent,
  WrapperComponent: Wrapper
});

export default Pager;
