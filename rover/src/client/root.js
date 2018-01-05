import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import search from './reducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  search
});

export default rootReducer;
