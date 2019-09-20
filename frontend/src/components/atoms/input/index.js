import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import renderingConditionSatisfied from '../../../services/shared/guard'

class UesInput extends Component {
    constructor() {
        super();
        this.state = {}
        this.getComponentForRendering = this.getComponentForRendering.bind(this);
    }

    handleInputChange = (e) => {
        this.props.change(e);
    }

    handleKeyDown = (e) => {
        if(this.props.onkeydown) this.props.onkeydown(e)
    };

    getComponentForRendering() {
        if (this.props.autocomplete) {
            return (
                <>
                    <label htmlFor={this.props.name}>
                    <input placeholder={this.props.placeholder} 
                           list={this.props.name} 
                           value={this.props.value}
                           name={this.props.name} 
                           type="text" 
                           onChange={this.handleInputChange}
                           onKeyDown={this.handleKeyDown} />
                    </label>
                    <datalist id={this.props.name}>
                        {this.props.autocomplete.map(item => {
                            return <option key={item} value={item}>{item}</option>
                        })}
                    </datalist>
                </>
            )
        }

        return (<input name={this.props.name} placeholder={this.props.placeholder} onChange={this.handleInputChange} onKeyDown={this.handleKeyDown} type={this.props.type}></input>)
    }

    render() {
        return (
            renderingConditionSatisfied(this.props.guards)
                ?
                this.getComponentForRendering()
                :
                <></>
        )
    }
}

export default withRouter(UesInput);