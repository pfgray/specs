import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReduxThunk from 'redux-thunk';

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

const store = createStore(
  combineReducers({
    test: (state = {}, action) => state,
    routing: routerReducer,
    launchForm: launchReducer,
    form: formReducer
  }),
  composeEnhancers(
    applyMiddleware(ReduxThunk)
  )
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route component={Layout}>
        <Route path="/" component={Launches} />
        <Route path="/registration" component={Registration} />
        <Route path="/commander" component={Commander} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('main')
);
