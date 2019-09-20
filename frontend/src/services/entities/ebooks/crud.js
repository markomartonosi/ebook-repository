import { backboneApiBaseUrl } from '../../shared/constants';
import  { mergeIncludedWithData } from '../../shared/util';
import { getDecodedAccessToken } from '../../shared/auth';
import axiosWrapper from '../../shared/axios-wrapper';

const EBOOKS_ENDPOINT= backboneApiBaseUrl + "/ebooks/";


function getEbooks(page) {
    return axiosWrapper.get(backboneApiBaseUrl + "/ebooks?page[number]=" + page).then(resp => {
        return mergeIncludedWithData(resp.data.data, resp.data.included);
    });
}


function getAllEbooks() {
    return axiosWrapper.get(EBOOKS_ENDPOINT)
        .then(resp => {
            return {"ebooks":mergeIncludedWithData(resp.data.data, resp.data.included)};
        })
}

function createEBook(ebookData) {//filename, author, title, keywords, publicationYear, languageId, categoryId) {
    let data = new FormData();
    data.append("filename", ebookData["file"]);
    data.append("author", ebookData["author"]);
    data.append("title", ebookData["title"]);
    data.append("keywords", ebookData["keywords"]);
    data.append("publication_year", parseInt(ebookData["publicationYear"]));
    data.append("user", '{"type": "User", "id": "'+getDecodedAccessToken().user_id+'"}');
    data.append("language", '{"type": "Language", "id": "'+parseInt(ebookData["language"])+'"}');
    data.append("category", '{"type": "Category", "id": "'+parseInt(ebookData["category"])+'"}');
    return axiosWrapper.post(EBOOKS_ENDPOINT, data).then(resp => {
        if(resp.status === 201) {
            return true;
        }
    }).catch(err => {
        return false;
    });
}

function updateEBook(id, filename, title, author, keywords, publicationYear, languageId, categoryId) {
    let data = new FormData();
    data.append("title", title);
    data.append("author", author);
    data.append("keywords", keywords);
    data.append("publication_year", publicationYear);
    data.append("user", '{"type": "User", "id": ' + getDecodedAccessToken().user_id + '}');

    if (filename != null) {
        data.append("filename", filename);
    }

    data.append("language", '{"type": "Language", "id": ' + parseInt(languageId) + '}');
    data.append("category", '{"type": "Category", "id": ' + parseInt(categoryId) + '}');
    return axiosWrapper.put(EBOOKS_ENDPOINT + id + "/", data).then(resp => {
        if(resp.status === 200) {
            return {"success": true, "extra": resp.data.data};
        }
    }).catch(err => {
        return {"success": false};
    });
}


function deleteEBook(id) {
    return axiosWrapper.delete(EBOOKS_ENDPOINT + id + "/").then(resp => {
        if(resp.status === 204) return true;
        return false;
    }).catch(err => {
        return false;
    });
}


export {
    getAllEbooks,
    getEbooks,
    createEBook,
    updateEBook,
    deleteEBook
}