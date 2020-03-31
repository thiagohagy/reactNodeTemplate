import React from 'react';
import { Router } from './core/Router';

import { Provider } from 'react-redux';
import store from './core/Store'

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router></Router>
      </Provider>
      
    </div>
  );
}

export default App;
