import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getAllCategories, updateCategory, deleteCategory, createCategory } from '../../../services/entities/categories/crud';

class CategoriesManagement extends Component {
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
        getAllCategories().then(resp => {
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
        this.setState({ "name": e.target.value });
    }

    handleSubmitClick() {

        if (this.state.name.trim() === "") {
            alert("Name must not be empty value!");
            return;
        }
        
        if (this.state.isCreate) {
            createCategory(this.state.name).then(resp => {
                if (resp.success) {
                    let categories = this.state.categories;
                    categories.push(resp["extra"]);
                    this.setState({ "open": false, "categories": categories });
                }
            })
        } else {
            updateCategory(this.state.id, this.state.name)
                .then(updateSucessful => {
                    if (updateSucessful) {
                        let categories = this.state.categories;
                        categories.forEach(item => {
                            if (item.id === this.state.id) {
                                item.attributes.name = this.state.name
                            }
                        })
                        this.setState({ "open": false, "categories": categories });
                    }
                })
        }
    }

    handleDeleteClick(e) {
        deleteCategory(this.state.id).then(deleteSuccessful => {
            if (deleteSuccessful) {
                let newCategories = this.state.categories.filter(item => {
                    return item.id !== this.state.id;
                });
                this.setState({ "categories": newCategories, "open": false });
            }
        })
    }

    handleCreateClick(e) {
        this.setState({ "open": true, "isCreate": true, "name": "" });
    }

    render() {
        const categories = this.state.categories || [];
        return (
            <>
                {this.state.open ?
                    <>
                        name: <input value={this.state.name} onChange={this.handleInputChange} placeholder="name" /> <br />
                        <button onClick={this.handleSubmitClick} datatype="categories">Submit</button>
                        <button onClick={this.handleCancelClick} datatype="categories">Cancel</button>
                        {!this.state.isCreate ? <button onClick={this.handleDeleteClick}>Delete</button> : <></>}
                    </>
                    :
                    <>
                        <button onClick={this.handleCreateClick}>Create</button>
                        {categories.map((category =>
                            <div className="book-wrapper link"
                                key={category.id}
                                onClick={this.handleBoxClick}
                                datavalue={category.attributes.name}
                                id={category.id}>
                                <h3>{category.attributes.name}</h3>
                            </div>
                        ))}<br />
                    </>
                }
            </>
        )
    }
}

export default CategoriesManagement;