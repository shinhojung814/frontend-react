import React from 'react';
import { render } from 'react-dom';
import { Provider, createStore } from 'react-redux';
import reducers from './modules';
import routes from './routes';

module.exports = render((
  <Provider store={createStore(reducers)}>
    {routes}
  </Provider>
), document.getElementById('app'))