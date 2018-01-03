import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  increment,
  decrement,
} from './reducer'

const Home = props => (
  <div>
    <h1>Home</h1>
    <p>Count: {props.count}</p>
    <button onClick={() => props.increment()}>PLUS ONE</button>
    <button onClick={() => props.decrement()}>MINUS ONE</button>

    <button onClick={() => props.changePage()}>Go to about page via redux</button>
  </div>
)

const mapStateToProps = state => ({
  count: state.counter.count,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  increment,
  decrement,
  changePage: () => push('/about-us')
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
