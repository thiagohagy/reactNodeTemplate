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

function PrivateRoute({ children, ...rest }) {

  const isAuth = useSelector(state => state.IS_USER_LOGGED);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}


export const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute path='/' exact > <Dash/> </PrivateRoute>
        <PrivateRoute path='/users' > <UsersHome/> </PrivateRoute>
        <PrivateRoute path='/clients' > <ClientsHome/> </PrivateRoute>
        <Route path='/login' component={Login}/>
      </Switch>
    </BrowserRouter>
  )
}

