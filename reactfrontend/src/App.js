import React from 'react';
import { Router } from './core/Router';

import { Provider } from 'react-redux';
import store from './core/Store'
import MainScreen from './components/ui/MainScreen';


function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <MainScreen></MainScreen>
      </Provider>
      
    </div>
  );
}

export default App;
