import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { match, Router, browserHistory } from 'react-router';
import {
  routerMiddleware,
  syncHistoryWithStore,
} from 'react-router-redux';
import LocaleProvider from '../common/components/utils/LocaleProvider';
import rootReducer from '../common/reducers';
import getRoutes from '../common/routes';
import setupLocale from './setupLocale';
import setupNProgress from './setupNProgress';
import setupGA from './setupGA';
import { setApiEngine } from '../common/actions/apiEngine';
import ApiEngine from '../common/utils/ApiEngine';

setupNProgress();
setupLocale();
let logPageView = setupGA();
const initialState = window.__INITIAL_STATE__;
let store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(
    routerMiddleware(browserHistory),
    thunk
  )
);

let apiEngine = new ApiEngine();
store.dispatch(setApiEngine(apiEngine));

// refs:
// - <http://www.jianshu.com/p/b3ff1f53faaf>
// - <https://github.com/ryanflorence/example-react-router-server-rendering-lazy-routes>
let history = syncHistoryWithStore(browserHistory, store);
let routes = getRoutes(store);
match({
  history,
  routes,
}, (error, redirectLocation, renderProps) => {
  if (error) {
    console.log(error);
  }
  render(
    <Provider store={store}>
      <LocaleProvider>
        <Router
          history={history}
          onUpdate={logPageView}
          {...renderProps}
        >
          {routes}
        </Router>
      </LocaleProvider>
    </Provider>
  , document.getElementById('root'));
});
