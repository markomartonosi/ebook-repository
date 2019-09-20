import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { register } from '../../../services/entities/users/crud';


class RegisterForm extends Component {
    constructor() {
        super();
        this.state = {}
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }



    handleInputChange(e) {
        this.setState({ [e.target.placeholder]: e.target.value });
    }

    handleSubmit(e) {
        register(this.state.firstname, this.state.lastname, this.state.username, this.state.password).then(sucessfullyRegistered => {
            if(sucessfullyRegistered) {
                this.props.history.push("/login");
                return;
            }

            alert("Something went wrong during registration!");
        });
    }

    render() {
        return (
            <>
                <input placeholder="firstname" onChange={this.handleInputChange}></input><br />
                <input placeholder="lastname" onChange={this.handleInputChange}></input><br />
                <input placeholder="username" onChange={this.handleInputChange}></input><br />
                <input placeholder="password" onChange={this.handleInputChange}></input><br />
                <button onClick={this.handleSubmit}>Submit</button>
            </>
        );
    }
}


export default withRouter(RegisterForm);