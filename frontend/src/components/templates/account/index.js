import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { isAdmin, getLoggedInUserUrl, getAccessToken, removeTokens } from '../../../services/shared/auth';
import UesButton from '../../atoms/button/index';

class Account extends Component {
    render() {
        return (
            <>
            <h2>Account</h2>
                {
                    getAccessToken() ?
                        <>
                            <UesButton redirect="/upload/" text="Upload" />
                            <UesButton redirect="/" text="Logout" clickAlternators={[removeTokens, ]}/>
                            <UesButton redirect={getLoggedInUserUrl()} text="Settings" />
                            <UesButton redirect="/admin/" text="Admin" guards={[isAdmin, ]} />
                        </>
                        :
                        <>
                            <UesButton redirect="/login/" text="Login" />
                            <UesButton redirect="/register/" text="Register" />
                        </>
                }
            </>
        );
    }
}


export default withRouter(Account);