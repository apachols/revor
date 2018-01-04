import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Home.css'

const Home = props => (
  <div>
    <img className="hero-image" src="doggy.jpg" alt="Hi doggy!" />
    <button onClick={() => props.changePage()}>Go to SEARCH</button>
  </div>
)

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: () => push('/search')
}, dispatch)

export default connect(
  null,
  mapDispatchToProps
)(Home)
