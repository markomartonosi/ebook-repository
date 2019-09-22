import React, { Component } from 'react';
import LoginForm from '../../organisms/login';
import { getAccessToken } from '../../../services/shared/auth';
class LoginPage extends Component {
  constructor() {
    super();
    if(getAccessToken()) window.location.replace("/");
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