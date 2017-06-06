import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import Header from './header/Header';
import Launches from './launches/Launches';
import Commander from './commander/Commander';
import Registration from './registration/Registration';

// const reducers = require.context('./', true, new RegExp('*Reducer\.js$'));

import { launchReducer } from './launches/launchReducer';

import { reducer as formReducer } from 'redux-form';

import 'bootstrap-loader';
import './index.less';

const store = createStore(
  combineReducers({
    test: (state = {}, action) => state,
    routing: routerReducer,
    launchForm: launchReducer,
    form: formReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
      <Router history={history}>
        <Route component={Header}>
          <Route path="/" component={Launches} />
          <Route path="/registration" component={Registration} />
          <Route path="/commander" component={Commander} />
        </Route>
      </Router>
    </Provider>,
  document.getElementById('main')
);
