import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { backboneApiBaseUrl } from '../../../services/shared/constants';
import { isAdmin } from '../../../services/shared/auth';
import Account from '../../templates/account';
import CategoriesManagement from '../../organisms/categories/index';
import EbooksManagement from '../../organisms/ebooks';
import LanguagesManagement from '../../organisms/languages';
import UserManagement from '../../organisms/users';
class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      "authorized": false,
      "categoriesOpen": false,
      "ebooksOpen": false,
      "ebooks": [],
      "categories": [],
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);

    this.handleBoxClick = this.handleBoxClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);

    this.constructEBook = this.constructEBook.bind(this);
  }



  componentDidMount() {
    if (isAdmin()) 
      this.setState({"authorized": true});
    
  }

  handleInputChange(e) {
    this.setState({ [e.target.attributes.typename.value]: e.target.value });
  }


  handleSelectChange(e) {
    if (e.target.attributes.typename.value === "changingEBookLanguage") {
      this.setState({ [e.target.attributes.typename.value]: this.getLanguageByName(e.target.value)[0].id });
    } else {
      this.setState({ [e.target.attributes.typename.value]: this.getCategoryByName(e.target.value)[0].id });
    }

  }


  onSelectChange(e) {
    this.setState({ "selectedCategories": Array.from(e.target.selectedOptions, (item) => item.value) });
  }

  handleBoxClick(e) {
    let el = e.target;
    if (el.tagName !== "DIV") {
      el = ReactDOM.findDOMNode(e.target).parentNode;
    }

    if (el.attributes.datatype.value === "categories") {
      this.setState({
        "changingCategoryId": el.attributes.dataid.value,
        "changingCategoryName": el.attributes.dataname.value
      });
    } else {
      this.setState({
        "changingEBookId": el.attributes.dataid.value,
        "changingEBookTitle": el.attributes.datatitle.value,
        "changingEBookAuthor": el.attributes.dataauthor.value,
        "changingEBookCategory": el.attributes.datacategory.value,
        "changingEBookUser": el.attributes.datauser.value,
        "changingEBookLanguage": el.attributes.datalanguage.value,
        "changingEBookKeywords": el.attributes.datakeywords.value,
        "changingEBookPublicationYear": el.attributes.datapublicationyear.value
      });
    }

    this.setState({ [el.attributes.datatype.value + "Open"]: true });
  }

  handleCancelClick(e) {
    this.setState({ [e.target.attributes.datatype.value + "Open"]: false });
  }


  handleSubmitClick(e) {
    const type = e.target.attributes.datatype.value;
    let elementData = {};
    let elementId = {};
    let requestHeaders = {};
    if (type === "categories") {
      elementId = this.state.changingCategoryId;
      if (this.state.changingCategoryName.trim() === "") {
        alert("Category name is mandatory!");
        return;
      }
      elementData = this.constructCategory();
      requestHeaders = { "Content-Type": "application/vnd.api+json" }
    } else {
      elementId = this.state.changingEBookId;
      if (this.state.changingEBookTitle.trim() === "") {
        alert("Title is mandatory!");
        return;
      }
      elementData = this.constructEBook();

    }

    axios.put(backboneApiBaseUrl + "/" + type + "/" + elementId + "/", elementData, {
      headers: requestHeaders
    }).then(resp => {
      if (resp.status === 200) {
        this.getData();
      }
    });
  }

  constructEBook() {
    let bookData = new FormData();
    bookData.append("title", this.state.changingEBookTitle);
    bookData.append("author", this.state.changingEBookAuthor);
    bookData.append("keywords", this.state.changingEBookKeywords);
    bookData.append("publication_year", this.state.changingEBookPublicationYear);
    bookData.append("user", '{"type": "User", "id": ' + this.state.changingEBookUser + '}');

    if (this.state.changingEBookFilename != null) {
      bookData.append("filename", this.state.changingEBookFilename);
    }

    bookData.append("language", '{"type": "Language", "id": ' + this.state.changingEBookLanguage + '}');
    bookData.append("category", '{"type": "Category", "id": ' + this.state.changingEBookCategory + '}');

    return bookData;
  }

  render() {
    return (
      this.state.authorized ?
        <>
          <Account /><br />

          <h2>E-Books</h2>
          <EbooksManagement />

          <h2>Categories</h2>
          <CategoriesManagement />

          <h2>Languages</h2>
          <LanguagesManagement/>

          <h2>Users</h2>
          <UserManagement/>

        </>
        :
        <> Forbidden </>

    );
  }
}
export default LoginPage;