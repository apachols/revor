import React from 'react';

const ReactUltimatePagination = require('react-ultimate-pagination');

const activeStyle = {
  fontWeight: 'bold',
  color: '#00bd70'
};

const Page = props => {
  return (
    <button className="pager-button" onClick={props.onClick} style={props.isActive ? activeStyle : null}>
      {props.value}
    </button>
  )
};

const Wrapper = props => {
  return <div className="pagination">{props.children}</div>
};

const itemTypeToComponent = {
  'PAGE': Page,
  'ELLIPSIS': props => <button className="pager-button" onClick={props.onClick}>...</button>,
  'PREVIOUS_PAGE_LINK': props => <button className="pager-button" onClick={props.onClick}>&lt;</button>,
  'NEXT_PAGE_LINK': props => <button className="pager-button" onClick={props.onClick}>&gt;</button>,
  'FIRST_PAGE_LINK': props => '',
  'LAST_PAGE_LINK': props => '',
};

const Pager = ReactUltimatePagination.createUltimatePagination({
  itemTypeToComponent: itemTypeToComponent,
  WrapperComponent: Wrapper
});

export default Pager;
