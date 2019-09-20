import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getAllEbooks, updateEBook, deleteEBook } from '../../../services/entities/ebooks/crud';
import { getAllCategories } from '../../../services/entities/categories/crud';
import { getAllLanguages } from '../../../services/entities/languages/crud';
import UesSelect from '../../atoms/select'
import {fromEntitiesToSelectOptions} from '../../../services/shared/util';
import UesButton from '../../atoms/button/index';

class EbooksManagement extends Component {
    constructor() {
        super();
        this.state = {
            "open": false,
        };
        this.handleBoxClick = this.handleBoxClick.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    componentDidMount() {
        getAllEbooks().then(resp => {
            this.setState(resp);
            return getAllCategories();
        }).then(resp1 => {
            this.setState(resp1);
            return getAllLanguages();
        }).then(resp2 => {
            this.setState(resp2);
        })
    }

    handleBoxClick(e) {
        let el = e.target;
        if (el.tagName !== "DIV") {
            el = ReactDOM.findDOMNode(e.target).parentNode;
        }

        this.setState({ 
            "id": el.id, 
            "title": el.attributes.datatitle.value,
            "author": el.attributes.dataauthor.value,
            "category": {"id": el.attributes.datacategoryid.value, "value": el.attributes.datacategoryname.value},
            "language": {"id": el.attributes.datalanguageid.value, "value": el.attributes.datalanguagename.value},
            "publicationYear": el.attributes.datapublicationyear.value,
            "keywords": el.attributes.datakeywords.value,
            "open": true });
    }

    handleCancelClick() {
        this.setState({ "open": false });
    }

    handleInputChange(e) {
        this.setState({ [e.target.attributes.name.value]: e.target.value });
    }

    handleSubmitClick() {
        updateEBook(
            this.state.id, 
            this.state.filename,
            this.state.title, 
            this.state.author, 
            this.state.keywords,
            this.state.publicationYear, 
            this.state.language.id, 
            this.state.category.id)
            .then(resp => {
                if (resp.success) {
                    const ebooks = this.state.ebooks;
                    ebooks.forEach(item => {
                        if(item.id === this.state.id) {
                            item.attributes.filename = this.state.filename;
                            item.attributes.author = this.state.author;
                            item.attributes.title = this.state.title;
                            item.attributes.filename = this.state.filename;
                            item.attributes.keywords = this.state.keywords;
                            item.attributes.publication_year = this.state.publicationYear;
                            item.relationships.category.attributes.name = this.state.category.value;
                            item.relationships.category.id = this.state.category.id;
                            item.relationships.language.attributes.name = this.state.language.value;
                            item.relationships.language.id = this.state.language.id;
                        }
                    });
                    this.setState({"ebooks": ebooks, "open": false});
                }
            })
    }

    handleFileSelect(e) {
        this.setState({"filename": e.target.files[0]});
    }

    handleSelectChange(e) {
        this.setState({[e.target.attributes.name.value]: ({"id": e.target.selectedOptions[0].id, "value":e.target.value}) });
    }

    handleDeleteClick(e) {
        deleteEBook(this.state.id).then(deleteSuccessful => {
            if(deleteSuccessful) {
                let ebooks = this.state.ebooks.filter(item => {
                    return item.id !== this.state.id;
                })
                this.setState({"ebooks": ebooks, "open": false});
            }
        })
    }

    render() {
        const ebooks = this.state.ebooks || [];
        return (
            <>
                {this.state.open ?
                    <>
                        file: <input type="file" onChange={this.handleFileSelect} /> <br />
                        title: <input value={this.state.title} onChange={this.handleInputChange} name="title"/> <br />
                        author: <input value={this.state.author} onChange={this.handleInputChange} name="author"/> <br />
                        category:<UesSelect options={fromEntitiesToSelectOptions(this.state.categories)} selected={this.state.category.value} change={this.handleSelectChange} name="category"/>
                        language:<UesSelect options={fromEntitiesToSelectOptions(this.state.languages)} selected={this.state.language.value} change={this.handleSelectChange} name="language" /><br />
                        keywords(split by ,): <input value={this.state.keywords} onChange={this.handleInputChange} name="keywords"/><br />
                        publication year: <input value={this.state.publicationYear} onChange={this.handleInputChange} type="number" name="publicationYear"/><br />
                        <button onClick={this.handleSubmitClick}>Submit</button>
                        <button onClick={this.handleCancelClick}>Cancel</button>
                        <button onClick={this.handleDeleteClick}>Delete</button>
                    </>
                    :
                    <>
                        <UesButton redirect="/upload" text="Upload" />
                        {ebooks.map((ebook =>
                            <div className="book-wrapper link"
                                key={ebook.id}
                                onClick={this.handleBoxClick}
                                id={ebook.id}
                                datatitle={ebook.attributes.title}
                                dataauthor={ebook.attributes.author}
                                datacategoryid={ebook.relationships.category.id}
                                datacategoryname={ebook.relationships.category.attributes.name}
                                datalanguageid={ebook.relationships.language.id}
                                datalanguagename={ebook.relationships.language.attributes.name}
                                datapublicationyear={ebook.attributes.publication_year}
                                datakeywords={ebook.attributes.keywords} >
                                    <h3>{ebook.attributes.title}</h3>
                                    <p>author: {ebook.attributes.author}</p>
                                    <p>category: {ebook.relationships.category.attributes.name} </p>
                                    <p>language: {ebook.relationships.language.attributes.name} </p>
                                    <p>keywords: {ebook.attributes.keywords}</p>
                                    <p>publication year: {ebook.attributes.publication_year}</p>
                            </div>
                        ))}<br />
                    </>
                }
            </>
        )
    }
}

export default EbooksManagement;