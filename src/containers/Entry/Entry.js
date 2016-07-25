import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import DevTools from '../DevTools/DevTools';

export function entry(component, store, rootElement) {
  const enhancer = compose(
    DevTools.instrument()
  );

  let entryStore = createStore(store, enhancer);
  let entryComponent = component;

  if (__DEVTOOLS__ && !window.devToolsExtension) {
    entryComponent = (
      <div>
        {component}
        <DevTools />
      </div>
    );
  }

  ReactDOM.render(
    <Provider store={entryStore} key="provider">
      {entryComponent}
    </Provider>,
    rootElement
  );
}

if (process.env.NODE_ENV !== 'production') {
  // enable debugger
  window.React = React;
}

if (module.hot) {
  module.hot.accept();
}
