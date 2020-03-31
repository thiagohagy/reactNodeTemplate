import { createStore } from 'redux';
const ls = require('local-storage');

const INITIAL_AUTH_STATE = {
  AUTH_TOKEN: ls('AUTH_TOKEN'),
  IS_USER_LOGGED:  ls('IS_USER_LOGGED'),
}

function authReducer(state = INITIAL_AUTH_STATE, action) {

  switch( action.type ) {
    case 'DO_LOGOUT':
      ls.clear();
      return { 
        ...state,
        AUTH_TOKEN: ls('AUTH_TOKEN'),
        IS_USER_LOGGED:  ls('IS_USER_LOGGED'),
        USER_DATA: ls('USER_DATA'),
      }
    case 'DO_LOGIN':
      ls('AUTH_TOKEN', action.token);
      ls('IS_USER_LOGGED', true);
      return { 
        ...state,
        AUTH_TOKEN: ls('AUTH_TOKEN'),
        IS_USER_LOGGED:  ls('IS_USER_LOGGED'),
      }
    default:
      return state
  }

}


const store = createStore(authReducer);

export default store;