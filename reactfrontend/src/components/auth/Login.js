import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import http from './../../core/Http';

const Login = (props) => {

  const dispatch = useDispatch();

  const [login, setLogin] = useState('root');
  const [password, setpassword] = useState('123')

  const sendLogin = async () =>{

    const response = await http.post('/login', { login, password });

    if (response.success) {
      dispatch({type: 'DO_LOGIN', ...response});
    } else {
      alert('login not ok')
    }

  }

  return (
    <div>
      Login works
      <Button variant='contained' color='primary' onClick={sendLogin}>Login</Button>
    </div>
  )
}

export default Login;
