import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Account from '../../templates/account';
import UesSelect from '../../atoms/select/index';
import { extractMetadataFromFile } from '../../../services/entities/ebooks/util';
import { createEBook } from '../../../services/entities/ebooks/crud';
import {fromEntitiesToSelectOptions} from '../../../services/shared/util';
import {validateEBook} from '../../../services/entities/ebooks/util';


class UploadForm extends Component {
    constructor() {
        super();
        this.state = {}
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    handleFileSelect(e) {
        let uploadedFile = e.target.files[0];
        extractMetadataFromFile(uploadedFile).then((resp) => this.setState(resp));
    }

    handleInputChange(e) {
        this.setState({[e.target.placeholder]: e.target.value});
    }

    handleSelectChange(e) {
        this.setState({[e.target.attributes.name.value]: e.target.selectedOptions[0].id});
    }

    handleSubmit(e) {
        const data = {
            "file": this.state.file,
            "title": this.state.title,
            "author": this.state.author,
            "keywords": this.state.keywords,
            "publicationYear": this.state.publicationYear,
            "language": this.state.language,
            "category": this.state.category
        };
        const dataValid = validateEBook(data);
        if(!dataValid) return;
        createEBook(data).then(uploadSuccessful => {
            if(uploadSuccessful){
                this.props.history.push("/");
                return;
            }
        });
    }


    render() {
        const categories = this.state.categories || [];
        const languages = this.state.languages || [];
        return (
            <>
                <Account/><br/>
                <h2>Upload</h2>
                <input onChange={this.handleFileSelect} type="file"></input><br/>
                {this.state.author != null ? <>author: <input placeholder="author" value={this.state.author} onChange={this.handleInputChange}/><br /></> : <></>}
                {this.state.title != null ? <>title: <input placeholder="title" value={this.state.title} onChange={this.handleInputChange}/><br /></> : <></>}
                {this.state.keywords != null ? <>keywords: <input placeholder="keywords" value={this.state.keywords} onChange={this.handleInputChange}/><br /></> : <></>}
                {this.state.file != null ? <>publication year: <input placeholder="publicationYear" value={this.state.publicationYear} onChange={this.handleInputChange} type="number" min="0"></input><br/></> : <></>}
                <UesSelect options={fromEntitiesToSelectOptions(categories)} value={this.state.category} change={this.handleSelectChange} name="category"/>
                <UesSelect options={fromEntitiesToSelectOptions(languages)} value={this.state.language} change={this.handleSelectChange} name="language"/>
                <button onClick={this.handleSubmit}>Submit</button>
            </>
        );
    }
}


export default withRouter(UploadForm);