import React, { Component } from 'react';
import { getAllUsers } from '../../../services/entities/users/crud';

class UserManagement extends Component {
    constructor() {
        super();
        this.state = {
            "users": [], 
        };
    }

    componentDidMount() {
        getAllUsers().then(resp => {
            this.setState(resp);
        })
    }

    render() {
        return (
            <>
                {this.state.users.map(user =>
                    <a key={user.id} href={"/user/" + user.id} style={{ textDecoration: "none", color: "inherit" }}>
                        <div className="book-wrapper link" >
                            <p>firstname: {user.attributes.first_name}</p>
                            <p>lastname: {user.attributes.last_name}</p>
                            <p>username: {user.attributes.username}</p>
                            <p>type: {user.attributes.type}</p>
                        </div></a>)}
            </>
        )
    }
}

export default UserManagement;