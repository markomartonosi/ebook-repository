import { backboneApiBaseUrl } from '../../shared/constants';
import axiosWrapper from '../../shared/axios-wrapper';

function mapFromBERespToSimpleEBook(BERespEBook) {
    return {
        "id": BERespEBook.id,
        "title": BERespEBook.attributes.title,
        "author": BERespEBook.attributes.author,
        "publicationYear": BERespEBook.attributes.publication_year,
        "filename": BERespEBook.attributes.filename,
        "keywords": BERespEBook.attributes.keywords,
        "category": { "id": BERespEBook.relationships.category.id, "name": BERespEBook.relationships.category.attributes.name },
        "language": { "id": BERespEBook.relationships.language.id, "name": BERespEBook.relationships.language.attributes.name }
    };
}

function mapFromESRespToSimpleEBook(ESRespEBook) {
    // TODO: change from hardcoded languge string to abbr.
    // TODO: remove'orig-title'/
    return {
        "id": ESRespEBook._id,
        "title": ESRespEBook._source.orig_title,
        "author": ESRespEBook._source.author,
        "publicationYear": ESRespEBook._source.publication_year,
        "filename": ESRespEBook._source.filename,
        "keywords": ESRespEBook._source.orig_keywords,
        "category": { "id": ESRespEBook._source.category.id, "name": ESRespEBook._source.category.name },
        "language": { "id": ESRespEBook._source.language.id, "name": ESRespEBook._source.language.name },
        "highlightField": getHighlightField(ESRespEBook.highlight),
        "featuredContent": getContentHighlight(ESRespEBook.highlight)
    }
}


function getHighlightField(highlights) {
    //Get field which is the most important in the flow of highlighting and return its name.
    //Hierarchy : title -> keywords -> content.
    if(!highlights) return "";
    
    const keys = Object.keys(highlights);
    if (keys.includes("title")) {
        return "title";
    } else if (keys.includes("keywords")) {
        return "keywords";
    } else {
        return "content";
    }
}

// Get highlight text from content.en or content.sr if any. 
function getContentHighlight(highlights) {
    if(!highlights) return "";

    let res = "";
    const keys = Object.keys(highlights);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i].includes("content")) {
            for (let j = 0; j < highlights[keys[i]].length; j++) {
                res += highlights[keys[i]][j];
            }
        }
    }
    return res;
}

function extractMetadataFromFile(file) {
    let data = new FormData();
    data.append("file", file);
    let retVal = {};
    return axiosWrapper.post(backboneApiBaseUrl + "/metadata", data).then(resp => {
        if (resp.status === 200) {
            retVal["file"] = file;
            retVal["author"] = resp.data.data.author || "";
            retVal["title"] = resp.data.data.title || "";
            retVal["keywords"] = resp.data.data.keywords || "";
            retVal["publicationYear"] = resp.data.data.publication_year || "";
            retVal["categories"] = resp.data.data.categories;
            retVal["category"] = resp.data.data.categories[0].id; //TODO: remove this 
            retVal["languages"] = resp.data.data.languages;
            retVal["language"] = resp.data.data.languages[0].id; //TODO: remove this
            return retVal;
        }
    }).catch(err => {
        const error = err.response;
        if (error.data.errors.detail === "file not pdf format") {
            alert("Selected file is not supported. Upload pdf!");
        }
    });
}



function validateEBook(data) {
    if (data["title"].trim() === "") {
        alert("Title mustn't be empty");
        return false;
    }

    if (data["author"].trim() === "") {
        alert("Author field mustn't be empty");
        return false;
    }

    if (data["publicationYear"].trim() === "") {
        alert("Publicaation year mustn't be empty");
        return false;
    }

    if (parseInt(data["publicationYear"]) < 1) {
        alert("Publication year must be positive number");
        return false;
    }


    return true;
}

export {
    mapFromBERespToSimpleEBook,
    mapFromESRespToSimpleEBook,
    extractMetadataFromFile,
    validateEBook
}