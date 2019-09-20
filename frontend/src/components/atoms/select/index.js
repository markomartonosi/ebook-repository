import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import renderingConditionSatisfied from '../../../services/shared/guard'

class UesSelect extends Component {
    constructor() {
        super();
        this.state = {}
    }

    handleSelectChange = (e) => {
        this.props.change(e);
    }

    render() {
        return (
            renderingConditionSatisfied(this.props.guards) && this.props.options.length > 0
                ?
                <select name={this.props.name} value={this.props.selected} onChange={this.handleSelectChange}>
                    {this.props.options.map(item => {
                        return <option id={item.id} key={item.id} value={item.value}>{item.value}</option>
                    })}
                </select>
                :
                <></>
        )
    }
}

export default withRouter(UesSelect);