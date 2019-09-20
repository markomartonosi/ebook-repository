import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import UesInput from '../../atoms/input/index';
import { logIn } from '../../../services/shared/auth';

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {}
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleSubmit() {
        logIn(this.state.username, this.state.password).then(logInSuccesfull => {
            if(logInSuccesfull) {
                this.props.history.push("/");
            } else {
                 alert("No active account found with the given credentials")
            }
        })
    }

    handleInputChange(e) {
        this.setState({[e.target.placeholder]: e.target.value});
    }

    render() {
        return (
            <>
                <UesInput placeholder="username" change={this.handleInputChange}/><br/>
                <UesInput placeholder="password" type="password" change={this.handleInputChange}/><br/>
                <button onClick={this.handleSubmit}>Submit</button>
            </>
        );
    }
}


export default withRouter(LoginForm);