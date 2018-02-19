import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReduxThunk from 'redux-thunk';

import Header from './header/Header';
import Launches from './launches/Launches';
import Commander from './commander/Commander';
import Registration from './registration/Registration';
import Login from './auth/Login';

// const reducers = require.context('./', true, new RegExp('*Reducer\.js$'));

import { launchReducer } from './launches/launchReducer';

import { reducer as formReducer } from 'redux-form';

import 'bootstrap-loader';
import './main.less';

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
    <MuiThemeProvider>
      <Router history={history}>
        <Route component={Header}>
          <Route path="/" component={Launches} />
          <Route path="/registration" component={Registration} />
          <Route path="/commander" component={Commander} />
          <Route path="/login" component={Login} />
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('main')
);
