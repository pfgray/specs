import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import createHistory from 'history/createBrowserHistory';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReduxThunk from 'redux-thunk';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import Layout from './layout/Layout';
import Launches from './launches/Launches';
import Commander from './commander/Commander';
import Registration from './registration/Registration';
import Login from './auth/Login';
import Signup from './auth/Signup';

// const reducers = require.context('./', true, new RegExp('*Reducer\.js$'));

import { launchReducer } from './launches/launchReducer';

import { reducer as formReducer } from 'redux-form';

import 'antd/dist/antd.less';
import './index.less';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const history = createHistory();
const routeMiddleware = routerMiddleware(history);

const store = createStore(
  combineReducers({
    test: (state = {}, action) => state,
    routing: routerReducer,
    launchForm: launchReducer,
    form: formReducer
  }),
  composeEnhancers(
    applyMiddleware(ReduxThunk),
    applyMiddleware(routeMiddleware)
  )
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route component={Layout} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('main')
);
