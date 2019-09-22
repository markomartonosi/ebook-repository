import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import UesInput from '../../atoms/input/index';
import UesSelect from '../../atoms/select/index';
import { processQueryAndFiltersFromUrl } from '../../../services/shared/search&filter';


class Filter extends Component {
    constructor() {
        super();
        this.state = {
            "filterType": "author",
            "filterAutocomplete": [],
            "appliedFilters": [],
            "filterValue": ""
        }
        this.handleFilterTypeSelect = this.handleFilterTypeSelect.bind(this);
        this.handleFilterApply = this.handleFilterApply.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        const urlQuery = this.props.match.params.query;
        const urlFilters = this.props.match.params.filters
        processQueryAndFiltersFromUrl(urlQuery, urlFilters).then(resp => {
            this.setState(resp);
        });
    }

    handleFilterTypeSelect(e) {
        const type = e.target.value;
        const filterValues = this.state[type];
        this.setState({ "filterType": type, "filterAutocomplete": filterValues });
    }

    handleFilterChange(e) {
        this.setState({ "filterValue": e.target.value });
    }

    handleFilterApply(e) {
        if(this.state.filterValue.trim() === "") {
            alert("Filter value mustn't be empty");
            return;
        }
        let appliedFilters = this.state.appliedFilters || [];
        const filterType = this.state["filterType"];
        appliedFilters.push(filterType + "=" + this.state.filterValue);
        let joined = appliedFilters.join("&");
        this.setState({ "filterValue": "", appliedFilters: joined });
        //TODO: encode decode URI
        this.props.history.push("/search/query=" + this.state.appliedQuery + "&filters=" + joined + "");
        window.location.reload();
    }
    

    handleKeyDown(e) {
        if(e.key === "Enter") {
            this.handleFilterApply();
        }
    }



    render() {
        var filterTypes = [{"id":1, "value": "author"}, {"id": 2, "value":"category"},{"id": 3, "value":"language"},{"id": 4, "value":"publication_year"}] //TODO: URI encoding(dont send publication_year)
        return (
            <>
                <span> or apply filters: </span>
                <UesSelect change={this.handleFilterTypeSelect} selected={this.state.filterType} options={filterTypes} />
                <UesInput name="filters" placeholder="Fillter ..." change={this.handleFilterChange} onkeydown={this.handleKeyDown} autocomplete={this.state.filterAutocomplete} />
                <button onClick={this.handleFilterApply}>Apply</button>
            </>
        );
    }
}


export default withRouter(Filter);