import React, { Component } from 'react';
import Filter from '../../organisms/filter';
import Account from '../../templates/account';
import { search } from '../../../services/shared/search&filter';
import UesButton from '../../atoms/button';
import { mapFromESRespToSimpleEBook } from '../../../services/entities/ebooks/util';
import Search from '../../organisms/search';
import EBook from '../../molecules/ebook';

class SearchPage extends Component {
  constructor() {
    super();
    this.state = { "data": [], "included": [] }
    this.renderAppliedFilters = this.renderAppliedFilters.bind(this);
  }

  componentDidMount() {
    const query = this.props.match.params.query || "";
    const filters = this.props.match.params.filters || "";
    search(query, filters).then(resp => this.setState({...resp, "query": query, "filters": filters }));
  }

  renderAppliedFilters() {
    const filters = (this.state.filters && this.state.filters.trim() !== "") ? this.state.filters.split("&") : [];
    if(filters.length >= 1) {
      return (
        <>
          {filters.map(filter =>
            <span style={{ borderRight: '1px solid black', fontStyle: 'italic' }} key={filter}>{filter}</span>
          )}
          <UesButton redirect="/" text="Reset filters" />
        </>
      )
    }
  }

  render() {
    const books = this.state.ebooks || [];
    return (
      <>
        <Account />
        <Search/>
        <Filter />
        {this.renderAppliedFilters()}
        <h2>Results </h2>
        <p>{this.state.searchedValue ? "'" + this.state.searchedValue + "' returned" : <></>} {books.length} results</p><br />
        {books.map((ebook => {
            const book = mapFromESRespToSimpleEBook(ebook);
            return( <EBook data={book} key={book.id} />)
        }
        ))}
      </>
    );
  }
}

export default SearchPage;