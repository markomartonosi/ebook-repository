import React, { Component } from 'react';
import { getDecodedAccessToken, isSubscribedToCategory, isAdmin } from '../../../services/shared/auth';

class EBook extends Component {
    constructor() {
        super();
        this.state = {}
        this.getClassnameForProp = this.getClassnameForProp.bind(this);
        this.getFeaturedContent = this.getFeaturedContent.bind(this);

    }

    getDownloadEbookSectionHTML(categoryId) {
        if (!getDecodedAccessToken()) {
            return (<a href="/login/">Log in to download ebook!</a>)
        }

        if (isAdmin() || isSubscribedToCategory(categoryId)) {
            return (<a href={this.props.data.filename} target="_blank" rel="noopener noreferrer">Download</a>)
        } else {
            return (<p>Subscribe to category to download ebook!</p>)
        }
    }

    // Used for highlighter fields(title, keywords and content).
    getClassnameForProp(property) {
        if (this.props.data.highlightField === property) return "highlight";
    }


    getFeaturedContent() {
        if (this.props.data.featuredContent !== "" && this.props.data.highlightField === "content") {
            return (
                <blockquote className="highlight" dangerouslySetInnerHTML={{ __html: this.props.data.featuredContent}}>
                </blockquote>
            );
        }
    }


    render() {
        return (
            <div className="book-wrapper" key={this.props.data.id}>
                <h3 className={this.getClassnameForProp("title")}>{this.props.data.title}</h3>
                <p>author: {this.props.data.author}</p>
                <p>category: {this.props.data.category.name}</p>
                <p>language: {this.props.data.language.name}</p>
                <p>publication year: {this.props.data.publicationYear}</p>
                <p>keywords: <span className={this.getClassnameForProp("keywords")}> {this.props.data.keywords} </span> </p>
                {this.getFeaturedContent()}
                {this.getDownloadEbookSectionHTML(this.props.data.category.id)}
            </div>
        )
    }
}


export default EBook;