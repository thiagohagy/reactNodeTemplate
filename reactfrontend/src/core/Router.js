import React from 'react'

import {
  BrowserRouter,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import { useSelector } from 'react-redux';

import Dash from './../components/dashboard/Dash';
import UsersHome from './../components/users/Home';
import ClientsHome from './../components/clients/Home';
import Login from './../components/auth/Login';
import Register from './../components/auth/Register';
import MainScreen from '../components/ui/MainScreen';

function PrivateRoute({ children, ...rest }) {

  const isAuth = useSelector(state => state.IS_USER_LOGGED);

  return (
    <Route
      {...rest}
      render={({ location }) =>
      {
        // put here your non private urls
        let goTo = '/login';
        switch (location.pathname) {
          case '/register':
            goTo = location.pathname
            break;
          default:
            break;
        }

        console.log(goTo);
        
        return isAuth ? (
          <MainScreen >
            { children }
          </MainScreen>
        ) : (
          <Redirect
            to={{
              pathname: goTo ,
              state: { from: location }
            }}
          />
        )
      }
      }
    />
  );
}


export const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
        <PrivateRoute path='/'> <Dash/> </PrivateRoute>
        <PrivateRoute path='/users' > <UsersHome/> </PrivateRoute>
        <PrivateRoute path='/clients' > <ClientsHome/> </PrivateRoute>
      </Switch>
    </BrowserRouter>
  )
}

