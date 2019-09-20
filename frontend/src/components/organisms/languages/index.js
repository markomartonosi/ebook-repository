import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getAllLanguages, updateLanguage, deleteLanguage, createLanguage } from '../../../services/entities/languages/crud';

class LanguagesManagement extends Component {
    constructor() {
        super();
        this.state = {
            "open": false,
        };
        this.handleBoxClick = this.handleBoxClick.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleCreateClick = this.handleCreateClick.bind(this);
    }

    componentDidMount() {
        getAllLanguages().then(resp => {
            this.setState(resp);
        })
    }

    handleBoxClick(e) {
        let el = e.target;
        if (el.tagName !== "DIV") {
            el = ReactDOM.findDOMNode(e.target).parentNode;
        }

        this.setState({ "id": el.id, "name": el.attributes.datavalue.value, "open": true, "isCreate": false });
    }

    handleCancelClick() {
        this.setState({ "open": false });
    }

    handleInputChange(e) {
        this.setState({"name": e.target.value});
    }

    handleSubmitClick() {

        if(this.state.name.trim() === "") {
            alert("Name must not be empty value!");
            return;
        }

        if(this.state.isCreate) {
            createLanguage(this.state.name).then(resp => {
                if(resp.success) {
                    let languages = this.state.languages;
                    languages.push(resp["extra"]);
                    this.setState({"open": false, "languages": languages});
                }
            })
        } else {
            updateLanguage(this.state.id, this.state.name)
            .then(updateSucessful => {
                if (updateSucessful) {
                    let languages = this.state.languages;
                    languages.forEach(item => {
                        if(item.id === this.state.id) {
                            item.attributes.name = this.state.name
                        }
                    })
                    this.setState({"open": false, "languages": languages});
                }
            })
        }
        
    }


    handleDeleteClick(e) {
        deleteLanguage(this.state.id).then(deleteSuccessful => {
            if(deleteSuccessful) {
                let newLanguages = this.state.languages.filter(item => {
                    return item.id !== this.state.id;
                });
                this.setState({"languages": newLanguages, "open": false});
            }
        }) 
    }

    handleCreateClick(e) {
        this.setState({"open": true, "isCreate": true, "name": "" });
    }

    render() {
        const languages = this.state.languages || [];
        return (
            <>
                {this.state.open ?
                    <>
                        name: <input value={this.state.name} onChange={this.handleInputChange} placeholder="name" /> <br />
                        <button onClick={this.handleSubmitClick}>Submit</button>
                        <button onClick={this.handleCancelClick}>Cancel</button>
                        {!this.state.isCreate ? <button onClick={this.handleDeleteClick}>Delete</button> : <></>}
                    </>
                    :
                    <>
                        <button onClick={this.handleCreateClick}>Create</button>
                        {languages.map((language =>
                            <div className="book-wrapper link"
                                key={language.id}
                                onClick={this.handleBoxClick}
                                datavalue={language.attributes.name}
                                id={language.id}>
                                <h3>{language.attributes.name}</h3>
                            </div>
                        ))}<br />
                    </>
                }
            </>
        )
    }
}

export default LanguagesManagement;