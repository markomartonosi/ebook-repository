import axiosWrapper from '../../shared/axios-wrapper';
import { backboneApiBaseUrl } from '../../shared/constants'


const LANGUAGES_ENDPOINT = backboneApiBaseUrl + "/languages/";

function getAllLanguages() {
    return axiosWrapper.get(LANGUAGES_ENDPOINT)
        .then(resp => {
            return { "languages": resp.data.data };
        });
}

function createLanguage(name) {
    const data = {
        "data": {
            "type": "Language",
            "attributes": {
                "name": name
            }
        }
    }

    return axiosWrapper.post(LANGUAGES_ENDPOINT, data, {
        headers: {
            "Content-Type": "application/vnd.api+json"
        }
    }).then(resp => {
        if(resp.status === 201) return {"success": true, "extra": resp.data.data};
        return false;
    }).catch(err => false);
}



function updateLanguage(id, name) {
    if (name.trim() === "") {
        alert("Name must not be empty value!");
        return;
    }

    const data = {
        "data": {
            "id": id,
            "type": "Language",
            "attributes": {
                "name": name
            }
        }
    }

    return axiosWrapper.put(LANGUAGES_ENDPOINT + id + "/", data, {
        headers: {
            "Content-Type": "application/vnd.api+json"
        }
    }).then(resp => {
        if (resp.status === 200) {
            return true;
        }
    });

}

function deleteLanguage(id) {
    return axiosWrapper.delete(LANGUAGES_ENDPOINT + id).then(resp => {
        if(resp.status === 204) {
            return true;
        } else {
            return false;
        }
    }).catch(err => {
        return false;
    })
}

export {
    getAllLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage
}