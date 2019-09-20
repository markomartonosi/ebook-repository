import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import UesButton from '../../atoms/button/index';
import UesInput from '../../atoms/input/index';


class Search extends Component {
    constructor() {
        super();
        this.state = {
            "query": ""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }


    handleInputChange(e) {
        this.setState({"query": e.target.value});
    }


    handleKeyDown(e) {
        if(e.key === "Enter") {
            this.props.history.push("/search/query=" + this.state.query + "&filters=");
            window.location.reload(); // TODO: remove this reload
        }
    }
    
    render() {
        return (
            <>
                <h2>Search</h2>
                <UesInput placeholder="Search.." change={this.handleInputChange} onkeydown={this.handleKeyDown}/>
                <UesButton redirect={"/search/query=" + this.state.query + "&filters="} text="Search"/>
            </>
        );
    }
}


export default withRouter(Search);