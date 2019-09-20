import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import renderingConditionSatisfied from '../../../services/shared/guard'
import { isAdmin } from '../../../services/shared/auth';

class UesButton extends Component {
    constructor() {
        super();
        this.state = {}
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        if (this.props.clickAlternators !== undefined) {
            this.props.clickAlternators.forEach(alternator => {
                alternator.call();
            });
        }

        const button = e.target;
        if (button.hasAttribute("redirect")) {
            this.props.history.push(button.attributes.redirect.value);
            //TODO: remove
            window.location.reload();
            return;
        }
    }

    render() {
        return (
            renderingConditionSatisfied(this.props.guards)
                ?
                <button redirect={this.props.redirect} onClick={this.handleClick}>{this.props.text}</button>
                :
                <></>
        )
    }
}

export default withRouter(UesButton);