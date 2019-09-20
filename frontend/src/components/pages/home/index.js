import React, { Component } from 'react';
import Account from '../../templates/account';
import Filter from '../../organisms/filter';
import Search from '../../organisms/search';
import EBook from '../../molecules/ebook/index'
import { getEbooks } from '../../../services/entities/ebooks/crud';
import {mapFromBERespToSimpleEBook} from '../../../services/entities/ebooks/util';

class HomePage extends Component {
  constructor() {
    super();
    this.state = { "data": [], "included": [] }
  }

  componentDidMount() {
    getEbooks(1).then(resp => {
      this.setState({"data": resp});
    });
  }

  render() {
    var books = this.state.data || [];
    return (
      <>
        <Account/>

        <Search/>

        <Filter/>

        <h2>Books</h2>

        {books.map((ebook =>
          <EBook data={mapFromBERespToSimpleEBook(ebook)} key={ebook.id}/>
        ))}
      </>
    );
  }
}
export default HomePage;
