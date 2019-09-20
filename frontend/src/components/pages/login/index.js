import React, { Component } from 'react';
import LoginForm from '../../organisms/login';
import { getAccessToken } from '../../../services/shared/auth';
class LoginPage extends Component {
  constructor() {
    if(getAccessToken()) window.location.replace("/");
    else super(); 
  }

  render() {
    return (
      <>
        <LoginForm/>
      </>
    )
  }
}
export default LoginPage;